import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateBrandDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsString()
  image?: string;

  @IsString()
  description?: string;

  @IsBoolean()
  active?: boolean;

  @IsBoolean()
  featured?: boolean;

  @IsBoolean()
  isDeleted?: boolean;
}