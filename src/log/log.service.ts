// src/log/log.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from './log.entity';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(Log)
    private readonly logRepo: Repository<Log>,
  ) {}

  /** Crée une entrée dans la table log */
  async write(user: string, action: string): Promise<Log> {
    const entry = this.logRepo.create({ user, action });
    return this.logRepo.save(entry);
  }

  /** Récupérer tout l’historique, trié par date la plus récente */
  findAll(): Promise<Log[]> {
    return this.logRepo.find({ order: { date_log: 'DESC' } });
  }
}
