// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    // src/auth/auth.service.ts
    async validateUser(username: string, mdp: string) {
        try {
            const user = await this.userService.validateCredentials(username, mdp);
            console.log(user?.username + "," + user?.mdp);
            if (!user) {
                throw new UnauthorizedException('Identifiants invalides');
            }
            const { mdp: _, ...result } = user;
            return result;
        } catch (err) {
            console.error('💥 Erreur complète dans validateUser :', err);
            if (err instanceof UnauthorizedException) throw err;
            throw new InternalServerErrorException(
                'Erreur interne lors de la validation de l’utilisateur'
            );
        }
    }


    async login(user: {username: string}): Promise<{access_token: string}> {
        try {
            const payload = { sub: user.username, username: user.username };
            return { access_token: this.jwtService.sign(payload) };
        } catch (err) {
            console.error('💥 Erreur dans login :', err);
            throw new InternalServerErrorException('Impossible de générer le token');
        }
    }
}
