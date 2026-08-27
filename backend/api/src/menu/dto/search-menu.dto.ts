import { IsOptional, IsString, IsNumber, Min, IsIn, IsBooleanString } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class SearchMenuDto extends PaginationDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @IsIn(['VEG', 'NON_VEG', 'EGG'])
  dietaryType?: string;

  @IsOptional()
  @IsBooleanString()
  availability?: string;

  @IsOptional()
  @IsIn(['price_asc', 'price_desc', 'name_asc', 'name_desc'])
  sort?: string;
}
