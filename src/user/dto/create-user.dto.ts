import { IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty({ message: 'Le nom d\'utilisateur est requis '})
    username: string;

    @IsNotEmpty({ message: 'Le mot de passe est requis'})
    plainPassword: string;
}