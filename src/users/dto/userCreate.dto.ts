import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    name!: string;

    @IsNotEmpty()
    @MinLength(11)
    phone!: string;

    @MinLength(6)
    password!: string;

    img!: string;
    address!: string
}