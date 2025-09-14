// src/bon-commande/bon-commande.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { BonCommandeService } from './bon-commande.service';
import { BonCommande } from './bon-commande.entity';
import { CreateBonCommandeDto } from './dto/create-bon-commande.dto';
import { UpdateBonCommandeDto } from './dto/update-bon-commande.dto';
import { CreateContenirDto } from './dto/create-contenir.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('bon-commande')
@UseGuards(JwtAuthGuard)
export class BonCommandeController {
  constructor(private readonly service: BonCommandeService) { }

  @Get()
  findAll(): Promise<BonCommande[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<BonCommande> {
    return this.service.findOne(id);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() dto: CreateBonCommandeDto): Promise<BonCommande> {
    return this.service.create(dto);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBonCommandeDto,
  ): Promise<BonCommande> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.remove(id);
  }

  // Routes optionnelles pour gérer Contenir séparément:

  // GET /bon-commande/:id/lignes
  @Get(':id/lignes')
  findAllLignes(@Param('id', ParseIntPipe) id: number) {
    return this.service.findAllLignes(id);
  }

  // PUT /bon-commande/lignes/:ligneId
  @Put('id_bon/lignes/:ref_scooter')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateLigne(
    @Param('id_bon', ParseIntPipe) id_bon: number,
    @Param('ref_scooter') ref_scooter: string,
    @Body() dto: Partial<CreateContenirDto>, // ou UpdateContenirDto si tu préfères
  ) {
    return this.service.updateLigne(id_bon, ref_scooter, dto);
  }

  // DELETE /bon-commande/lignes/:ligneId
  @Delete(':id_bon/lignes/:ref_scooter')
  removeLigne(
    @Param('id_bon', ParseIntPipe) id_bon: number,
    @Param('ref_scooter') ref_scooter: string,
  ) {
    return this.service.removeLigne(id_bon, ref_scooter);
  }
}
