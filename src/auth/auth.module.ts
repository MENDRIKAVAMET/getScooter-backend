// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.startegy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    // On importe ConfigModule pour accéder aux variables d'environnement
    ConfigModule,

    // PassportModule installe la mécanique de Passport (ici pour JWT)
    PassportModule,

    // JwtModule configuré dynamiquement à partir de ConfigService
    JwtModule.registerAsync({
      imports: [ConfigModule],         // on importe ConfigModule pour injecter ConfigService
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),               // récupère JWT_SECRET depuis .env
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '1h', // récupère JWT_EXPIRES_IN ou '1h' par défaut
        },
      }),
      inject: [ConfigService],
    }),

    // On importe UserModule pour pouvoir valider les identifiants via UserService
    UserModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
  ],
  controllers: [AuthController],
  exports: [
    AuthService,
    JwtAuthGuard,
  ],
})
export class AuthModule { }
