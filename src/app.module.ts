import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientModule } from './client/client.module';
import { Client } from './client/client.entity';
import { ScooterModule } from './scooter/scooter.module';
import { Scooter } from './scooter/scooter.entity';
import { BonCommandeModule } from './bon-commande/bon-commande.module';
import { BonCommande } from './bon-commande/bon-commande.entity';
import { Contenir } from './bon-commande/contenir.entity';
import { LogModule } from './log/log.module';
import { Log } from './log/log.entity';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [Client, Scooter, BonCommande, Contenir, User, Log],
    }),
    ClientModule,
    ScooterModule,
    BonCommandeModule,
    LogModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
