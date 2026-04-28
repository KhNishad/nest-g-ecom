import { IsEnum, IsNotEmpty, MinLength, IsOptional } from 'class-validator';
import { Role } from 'src/commons/enums/role.enum';

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

    @IsEnum(Role)
    @IsOptional()
    role?: Role;
}