import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsNumber, IsBoolean } from 'class-validator';

export class UpdateClassDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Class number',
    example: 1,
    required: false,
    type: 'number',
  })
  class_number?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Teacher name',
    example: 'Kayki Letieri',
    required: false,
    type: 'string',
  })
  teacher_name?: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'ID of the period',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
    type: 'string',
  })
  period_id?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Is the class active?',
    example: true,
    required: false,
  })
  is_active?: boolean;
}
