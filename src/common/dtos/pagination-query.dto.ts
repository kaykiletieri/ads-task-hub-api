import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    required: false,
    type: 'number',
  })
  page?: number = 1;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    required: false,
    type: 'number',
  })
  limit?: number = 10;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Field to order by',
    example: 'created_at',
    required: false,
    type: 'string',
  })
  order_by?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Order direction',
    example: 'ASC',
    required: false,
    enum: ['ASC', 'DESC'],
  })
  order_direction?: 'ASC' | 'DESC';
}
