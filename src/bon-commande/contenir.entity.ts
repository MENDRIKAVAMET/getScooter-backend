// src/bon-commande/contenir.entity.ts
import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { BonCommande } from './bon-commande.entity';
import { Scooter } from '../scooter/scooter.entity';

@Entity('contenir')
export class Contenir {
  @PrimaryColumn()
  ref_scooter: string;

  @ManyToOne(() => Scooter, (scooter) => scooter.contenirs, { eager: true })
  @JoinColumn({ name: 'ref_scooter' })
  scooter: Scooter;

  @PrimaryColumn()
  id_bon: number;

  @ManyToOne(() => BonCommande, (bonCommande) => bonCommande.contenirs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_bon' })
  bonCommande: BonCommande;

  @Column('int')
  quantite_cmd: number;

  @Column('date')
  date_cmd: string; // ou Date, selon le mapping

  @Column('decimal', { precision: 10, scale: 2 })
  remise: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total_prix: number;
}
