// src/scooter/scooter.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scooter } from './scooter.entity';
import { ScooterService } from './scooter.service';
import { ScooterController } from './scooter.controller';
import { LogModule } from 'src/log/log.module';

@Module({
  imports: [TypeOrmModule.forFeature([Scooter]), LogModule],
  providers: [ScooterService],
  controllers: [ScooterController],
})
export class ScooterModule { }
