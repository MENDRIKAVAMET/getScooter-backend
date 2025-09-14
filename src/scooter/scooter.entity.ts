import { Contenir } from 'src/bon-commande/contenir.entity';
import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';

@Entity('scooter')
export class Scooter {
  @PrimaryColumn()
  ref_scooter: string;

  @Column()
  marque: string;

  @Column()
  modele: string;

  @Column('decimal', { precision: 10, scale: 2 })
  prix: number;

  @Column()
  quantite_stock: number;

  @OneToMany(() => Contenir, (contenir) => contenir.scooter)
  contenirs: Contenir[];
}
