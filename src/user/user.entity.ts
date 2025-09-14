// src/user/user.entity.ts
import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryColumn({ unique: true })
  username: string;

  @Column()
  mdp: string; // ici on stockera le mot de passe (idéalement haché)
}
