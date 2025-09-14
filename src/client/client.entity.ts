// src/client/client.entity.ts
import { BonCommande } from 'src/bon-commande/bon-commande.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
@Entity('client')
export class Client {
  @PrimaryGeneratedColumn()
  id_client: number;

  @Column()
  nom: string;

  @Column()
  prenom: string;

  @Column()
  phone: string;

  @Column()
  cin: string;

  @Column()
  pays: string;

  @Column()
  ville: string;

  @Column()
  date_naiss: Date;

  @OneToMany(() => BonCommande, (bon) => bon.client)
  bonCommandes: BonCommande[];
}
