// src/bon-commande/dto/update-contenir.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateContenirDto } from './create-contenir.dto';

export class UpdateContenirDto extends PartialType(CreateContenirDto) {}
