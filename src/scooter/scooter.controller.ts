import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ScooterService } from './scooter.service';
import { Scooter } from './scooter.entity';

@Controller('scooter')
@UseGuards(JwtAuthGuard)
export class ScooterController {
  constructor(private readonly scooterService: ScooterService) { }

  @Get()
  findAll(): Promise<Scooter[]> {
    return this.scooterService.findAll();
  }

  @Get(':ref')
  findOne(@Param('ref') ref_scooter: string): Promise<Scooter> {
    return this.scooterService.findOne(ref_scooter);
  }

  @Post()
  create(@Body() data: Partial<Scooter>, @Req() req: any): Promise<Scooter> {
    const user = req.user.username;
    return this.scooterService.create(data, user);
  }

  @Put(':ref')
  update(
    @Param('ref') ref_scooter: string,
    @Body() data: Partial<Scooter>,
    @Req() req: any,
  ): Promise<Scooter> {
    const user = req.user.username;
    return this.scooterService.update(ref_scooter, data, user);
  }

  @Delete(':ref')
  remove(@Param('ref') ref_scooter: string, @Req() req: any,): Promise<void> {
    const user = req.user.username;
    return this.scooterService.remove(ref_scooter, user);
  }
}
