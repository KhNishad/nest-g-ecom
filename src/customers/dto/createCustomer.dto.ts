import { IsEnum, IsNotEmpty, MinLength, IsOptional, IsBoolean } from 'class-validator';

export class CreateCustomerDto {
    @IsNotEmpty()
    name!: string;

    @IsNotEmpty()
    @MinLength(11)
    phone!: string;
    
    password!: string;

    img!: string;
    address!: string

    @IsBoolean()
    status!:boolean
}