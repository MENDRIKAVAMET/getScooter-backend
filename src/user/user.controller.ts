// src/user/user.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  // GET /user
  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  // GET /user/:username
  @Get(':username')
  findOne(@Param('username') username: string): Promise<User> {
    return this.userService.findOneByUsername(username);
  }

  // POST /user (création)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // POST /user/login (authentification simple)
  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('mdp') mdp: string,
  ): Promise<{ username: string }> {
    const user = await this.userService.validateCredentials(username, mdp);
    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }
    return { username: user.username };
  }

  // PUT /user/:username (mise à jour)
  @Put(':username')
  update(
    @Param('username') username: string,
    @Body('mdp') mdp: string,
  ): Promise<User> {
    return this.userService.update(username, mdp);
  }

  // DELETE /user/:username (suppression)
  @Delete(':username')
  remove(@Param('username') username: string): Promise<void> {
    return this.userService.remove(username);
  }
}
