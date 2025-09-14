// src/user/user.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) { }

  /**
   * Crée un nouvel utilisateur. Vérifie d’abord si username existe déjà.
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const {username, plainPassword } = createUserDto;
    const existing = await this.userRepo.findOneBy({ username });
    if (existing) {
      throw new ConflictException(`Le nom d'utilisateur "${username}" existe déjà.`);
    }
    if(!plainPassword)
    {
      throw new BadRequestException("Le mot de passe est requis");
    }
    const hashed = await bcrypt.hash(plainPassword, 10);
    const user = this.userRepo.create({ username, mdp: hashed });
    return this.userRepo.save(user);
  }

  /**
   * Retourne tous les utilisateurs (y compris leur hash de mot de passe — à éviter en prod).
   */
  async findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  /**
   * Récupère un utilisateur par username.
   */
  async findOneByUsername(username: string): Promise<User> {
    const user = await this.userRepo.findOneBy({ username });
    if (!user) {
      throw new NotFoundException(`Utilisateur "${username}" introuvable.`);
    }
    return user;
  }

  /**
   * Met à jour le mot de passe d’un utilisateur.
   */
  async update(username: string, plainPassword: string): Promise<User> {
    const user = await this.findOneByUsername(username);
    const hashed = await bcrypt.hash(plainPassword, 10);
    user.mdp = hashed;
    return this.userRepo.save(user);
  }

  /**
   * Supprime un utilisateur par username.
   */
  async remove(username: string): Promise<void> {
    const res = await this.userRepo.delete({ username });
    if (res.affected === 0) {
      throw new NotFoundException(`Utilisateur "${username}" introuvable.`);
    }
  }

  /**
   * Vérifie les identifiants : username + mot de passe.
   */
  async validateCredentials(
    username: string,
    plainPassword: string,
  ): Promise<User | null> {
    const user = await this.userRepo.findOneBy({ username });
    if (!user) return null;

    const isMatch = await bcrypt.compare(plainPassword, user.mdp);
    return isMatch ? user : null;
  }
}
