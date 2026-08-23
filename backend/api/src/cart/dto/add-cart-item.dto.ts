import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  IsArray,
  IsOptional,
} from 'class-validator';

export class AddCartItemDto {
  @IsString()
  @IsNotEmpty()
  menuItemId: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  addonIds?: string[];
}
