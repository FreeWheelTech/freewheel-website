import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsBoolean,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { DietaryType } from '@prisma/client';

export class UpdateMenuItemDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsBoolean()
  @IsOptional()
  availability?: boolean;

  @IsEnum(DietaryType)
  @IsOptional()
  dietaryType?: DietaryType;
}
