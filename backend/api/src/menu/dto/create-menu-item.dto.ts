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

export class CreateMenuItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsBoolean()
  @IsOptional()
  availability?: boolean;

  @IsEnum(DietaryType)
  @IsOptional()
  dietaryType?: DietaryType;
}
