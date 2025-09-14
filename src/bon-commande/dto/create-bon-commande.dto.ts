/* eslint-disable @typescript-eslint/no-unsafe-call */
// src/bon-commande/dto/create-bon-commande.dto.ts
import { IsInt, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateContenirDto } from './create-contenir.dto';

export class CreateBonCommandeDto {
  @IsInt()
  id_client: number;

  @IsNumber()
  total_ht: number;

  @IsNumber()
  tva: number;

  @IsNumber()
  total_ttc: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateContenirDto)
  contenirs: CreateContenirDto[];
}
