/* eslint-disable @typescript-eslint/no-unsafe-call */
// src/bon-commande/dto/create-contenir.dto.ts
import { IsString, IsInt, IsDateString, IsNumber } from 'class-validator';

export class CreateContenirDto {
  @IsString()
  ref_scooter: string;

  @IsInt()
  quantite_cmd: number;

  @IsDateString()
  date_cmd: string;

  @IsNumber()
  remise: number;

  @IsNumber()
  total_prix: number;
}
