// src/app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // GET /    → renvoie "Hello World!"
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
