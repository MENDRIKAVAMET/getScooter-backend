import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')      // ← préfixe de route "/auth"
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')        // ← route POST /auth/login
    async login(
        @Body('username') username: string,
        @Body('mdp') mdp: string,
    ) {
        const user = await this.authService.validateUser(username, mdp);
        return this.authService.login(user);
    }
}
