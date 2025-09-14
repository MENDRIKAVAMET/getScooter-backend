import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Client } from 'src/client/client.entity';
import { Contenir } from './contenir.entity';

@Entity('bon_commande')
export class BonCommande {
  @PrimaryGeneratedColumn()
  id_bon: number;

  @Column()
  id_client: number;

  @ManyToOne(() => Client, (client) => client.bonCommandes, { eager: true })
  @JoinColumn({ name: 'id_client' })
  client: Client;

  @Column('decimal', { precision: 13, scale: 2 })
  total_ht: number;

  @Column('decimal', { precision: 4, scale: 2 })
  tva: number;

  @Column('decimal', { precision: 13, scale: 2 })
  total_ttc: number;

  @OneToMany(() => Contenir, (contenir) => contenir.bonCommande, {
    cascade: true,
    eager: true,
  })
  contenirs: Contenir[];
}
