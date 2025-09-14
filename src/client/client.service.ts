// src/client/client.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './client.entity';
import { LogService } from '../log/log.service';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepo: Repository<Client>,
    private readonly logService: LogService,
  ) { }

  async findAll(): Promise<Client[]> {
    return this.clientRepo.find();
  }

  async findOne(id_client: number): Promise<Client> {
    const client = await this.clientRepo.findOneBy({ id_client });
    if (!client) throw new NotFoundException(`Client ${id_client} introuvable`);
    return client;
  }

  async create(data: Partial<Client>, user: string): Promise<Client> {
    const nouveau = this.clientRepo.create(data);
    const saved = await this.clientRepo.save(nouveau);
    await this.logService.write(user, `enregistrement d'un client ${saved.id_client}`);
    return saved;
  }

  async update(
    id_client: number,
    data: Partial<Client>,
    user: string,
  ): Promise<Client> {
    const existing = await this.clientRepo.findOneBy({ id_client });
    if (!existing)
      throw new NotFoundException(`Client ${id_client} introuvable`);
    await this.clientRepo.update({ id_client }, data);
    const updated = await this.clientRepo.findOneBy({ id_client });
    await this.logService.write(user, `modification d'un client ${id_client}`);
    return updated!;
  }

  async remove(id_client: number, user: string): Promise<void> {
    const res = await this.clientRepo.delete({ id_client });
    if (res.affected === 0)
      throw new NotFoundException(`Client ${id_client} introuvable`);
    await this.logService.write(user, `suppression d'un client ${id_client}`);
  }
}
