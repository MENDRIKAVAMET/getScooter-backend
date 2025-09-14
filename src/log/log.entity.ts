// src/log/log.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('log')
export class Log {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user: string; // tu peux stocker l’username ou l’ID du user

  @Column()
  action: string; // ex: "CREATE client 5" ou "DELETE scooter X"

  @CreateDateColumn({ name: 'date_log' })
  date_log: Date; // date d’insertion automatique
}
