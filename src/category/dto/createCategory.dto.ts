import { IsEnum, IsNotEmpty, MinLength, IsOptional, IsBoolean, IsString, Allow, IsNumber } from 'class-validator';

export class CreateCategoryDto {
    @IsNotEmpty()
    name!: string;

    @IsString()
    @Allow()
    image!: string;

    @IsString()
    @Allow()
    description!: string;

    @IsNotEmpty()
    @IsBoolean()
    active!: boolean

    @IsNotEmpty()
    @IsBoolean()
    featured!: boolean

    @IsNumber()
    @Allow()
    position!: number
}