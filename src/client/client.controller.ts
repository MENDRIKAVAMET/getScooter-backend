// src/client/client.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { ClientService } from './client.service';
import { Client } from './client.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('client')
@UseGuards(JwtAuthGuard)
export class ClientController {
  constructor(private readonly clientService: ClientService) { }

  @Get()
  findAll(): Promise<Client[]> {
    return this.clientService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Client> {
    return this.clientService.findOne(id);
  }

  @Post()
  create(
    @Body() data: Partial<Client>,
    @Req() req: any,              // req.user contient l’objet JWT
  ): Promise<Client> {
    const user = req.user.username; // ou req.user.id, selon ta stratégie JWT
    return this.clientService.create(data, user);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Client>,
    @Req() req: any,
  ): Promise<Client> {
    const user = req.user.username;
    return this.clientService.update(id, data, user);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ): Promise<void> {
    const user = req.user.username;
    return this.clientService.remove(id, user);
  }
}
