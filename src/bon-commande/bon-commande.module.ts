// src/bon-commande/bon-commande.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BonCommande } from './bon-commande.entity';
import { Contenir } from './contenir.entity';
import { BonCommandeService } from './bon-commande.service';
import { BonCommandeController } from './bon-commande.controller';
import { Client } from '../client/client.entity'; // pour les relations
import { Scooter } from '../scooter/scooter.entity'; // idem
import { LogModule } from 'src/log/log.module';

@Module({
  imports: [TypeOrmModule.forFeature([BonCommande, Contenir, Client, Scooter]), LogModule],
  providers: [BonCommandeService],
  controllers: [BonCommandeController],
})
export class BonCommandeModule { }
