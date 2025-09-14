/* eslint-disable @typescript-eslint/no-unsafe-call */
// src/bon-commande/dto/update-bon-commande.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateBonCommandeDto } from './create-bon-commande.dto';

export class UpdateBonCommandeDto extends PartialType(CreateBonCommandeDto) {}
