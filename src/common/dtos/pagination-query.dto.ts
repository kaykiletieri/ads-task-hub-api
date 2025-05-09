import { IsOptional, IsInt, Min, IsString } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsString()
  page?: number = 1;

  @IsOptional()
  @IsString()
  limit?: number = 10;

  @IsOptional()
  @IsString()
  order_by?: string;

  @IsOptional()
  @IsString()
  order_direction?: 'ASC' | 'DESC';
}
