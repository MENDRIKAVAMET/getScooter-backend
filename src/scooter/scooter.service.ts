import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Scooter } from './scooter.entity';
import { LogService } from 'src/log/log.service';

@Injectable()
export class ScooterService {
  constructor(
    @InjectRepository(Scooter)
    private scooterRepo: Repository<Scooter>,
    private readonly logService: LogService,
  ) { }

  async findAll(): Promise<Scooter[]> {
    return this.scooterRepo.find();
  }

  async findOne(ref_scooter: string): Promise<Scooter> {
    const sc = await this.scooterRepo.findOneBy({ ref_scooter });
    if (!sc) {
      throw new NotFoundException(`Scooter '${ref_scooter}' non trouvé`);
    }
    return sc;
  }

  async create(data: Partial<Scooter>, user: string): Promise<Scooter> {
    const nouveau = this.scooterRepo.create(data);
    const saved = await this.scooterRepo.save(nouveau);
    await this.logService.write(user, `enregistrement d'un scooter ${saved.ref_scooter}`);
    return saved;
  }

  async update(ref_scooter: string, data: Partial<Scooter>, user: string): Promise<Scooter> {
    const existant = await this.scooterRepo.findOneBy({ ref_scooter });
    if (!existant) {
      throw new NotFoundException(`Scooter '${ref_scooter}' non trouvé`);
    }
    await this.scooterRepo.update({ ref_scooter }, data);
    const updated = await this.scooterRepo.findOneBy({ ref_scooter });
    if (!updated) {
      throw new NotFoundException(
        `Scooter '${ref_scooter}' non trouvé après mis à jour `,
      );
    }
    await this.logService.write(user, `modification d'un scooter ${ref_scooter}`);
    return updated;
  }

  async remove(ref_scooter: string, user: string): Promise<void> {
    const res = await this.scooterRepo.delete({ ref_scooter });
    if (res.affected === 0) {
      throw new NotFoundException(`Scooter '${ref_scooter}' non trouvé`);
    }
    await this.logService.write(user, `suppression d'un scooter ${ref_scooter}`);
  }
}
