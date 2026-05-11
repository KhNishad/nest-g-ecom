import { IsNotEmpty,  IsBoolean, IsString, Allow, IsNumber } from 'class-validator';

export class UpdateCategoryDto {
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