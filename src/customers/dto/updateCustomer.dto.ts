import {  IsNotEmpty,  IsBoolean } from 'class-validator';

export class UpdateCustomerDto {
    @IsNotEmpty()
    name!: string;

    @IsNotEmpty()
    password!: string;

    img!: string;
    address!: string
    district!: string;
    city!: string;

    @IsBoolean()
    active!: boolean
}