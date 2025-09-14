// src/bon-commande/bon-commande.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { BonCommande } from './bon-commande.entity';
import { Contenir } from './contenir.entity';
import { CreateBonCommandeDto } from './dto/create-bon-commande.dto';
import { UpdateBonCommandeDto } from './dto/update-bon-commande.dto';
import { CreateContenirDto } from './dto/create-contenir.dto';
import { LogService } from 'src/log/log.service';

@Injectable()
export class BonCommandeService {
  constructor(
    @InjectRepository(BonCommande)
    private bonCommandeRepo: Repository<BonCommande>,
    @InjectRepository(Contenir)
    private contenirRepo: Repository<Contenir>,
    private dataSource: DataSource,
    private readonly logService: LogService,        // ← injection
  ) {}

  findAll(): Promise<BonCommande[]> {
    return this.bonCommandeRepo.find();
  }

  async findOne(id_bon: number): Promise<BonCommande> {
    const bc = await this.bonCommandeRepo.findOne({ where: { id_bon } });
    if (!bc) {
      throw new NotFoundException(`BonCommande ${id_bon} non trouvé`);
    }
    return bc;
  }

  async create(data: CreateBonCommandeDto): Promise<BonCommande> {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      const { id_client, total_ht, tva, total_ttc, contenirs } = data;
      const nouvelle = this.bonCommandeRepo.create({ id_client, total_ht, tva, total_ttc });
      const saved = await qr.manager.save(nouvelle);

      for (const ligneDto of contenirs) {
        const newLigne = this.contenirRepo.create({
          ...ligneDto,
          id_bon: saved.id_bon,
        });
        await qr.manager.save(newLigne);
      }

      await qr.commitTransaction();

      // log après création
      await this.logService.write(
        'system',
        `Création de la commande #${saved.id_bon}`,
      );

      return this.findOne(saved.id_bon);
    } catch (err) {
      await qr.rollbackTransaction();
      console.error('Erreur création commande :', err);
      throw new BadRequestException(err.message || 'Erreur inconnue');
    } finally {
      await qr.release();
    }
  }

  async update(id_bon: number, data: UpdateBonCommandeDto): Promise<BonCommande> {
    const existing = await this.bonCommandeRepo.findOneBy({ id_bon });
    if (!existing) {
      throw new NotFoundException(`BonCommande ${id_bon} non trouvé`);
    }
    await this.bonCommandeRepo.update(
      { id_bon },
      {
        total_ht: data.total_ht ?? existing.total_ht,
        tva: data.tva ?? existing.tva,
        total_ttc: data.total_ttc ?? existing.total_ttc,
      },
    );

    const updated = await this.findOne(id_bon);

    // log mise à jour
    await this.logService.write(
      'system',
      `Modification de la commande #${id_bon}`,
    );

    return updated;
  }

  async remove(id_bon: number): Promise<void> {
    const res = await this.bonCommandeRepo.delete({ id_bon });
    if (res.affected === 0) {
      throw new NotFoundException(`BonCommande ${id_bon} non trouvé`);
    }

    // log suppression
    await this.logService.write(
      'system',
      `Suppression de la commande #${id_bon}`,
    );
  }

  findAllLignes(id_bon: number): Promise<Contenir[]> {
    return this.contenirRepo.find({ where: { id_bon } });
  }

  async updateLigne(
    id_bon: number,
    ref_scooter: string,
    data: Partial<CreateContenirDto>,
  ): Promise<Contenir> {
    const ligne = await this.contenirRepo.findOneBy({ id_bon, ref_scooter });
    if (!ligne) {
      throw new NotFoundException(
        `Ligne ${id_bon} & ${ref_scooter} non trouvée`,
      );
    }
    await this.contenirRepo.update({ id_bon, ref_scooter }, data);
    const updated = await this.contenirRepo.findOneBy({ id_bon, ref_scooter });
    if (!updated) {
      throw new NotFoundException(
        `Ligne ${id_bon} & ${ref_scooter} introuvable après mise à jour`,
      );
    }

    // log mise à jour de ligne
    await this.logService.write(
      'system',
      `Modification de la ligne [commande #${id_bon}, scooter ${ref_scooter}]`,
    );

    return updated;
  }

  async removeLigne(id_bon: number, ref_scooter: string): Promise<void> {
    const res = await this.contenirRepo.delete({ id_bon, ref_scooter });
    if (res.affected === 0) {
      throw new NotFoundException(
        `Ligne ${id_bon} & ${ref_scooter} non trouvée`,
      );
    }

    // log suppression de ligne
    await this.logService.write(
      'system',
      `Suppression de la ligne [commande #${id_bon}, scooter ${ref_scooter}]`,
    );
  }
}
