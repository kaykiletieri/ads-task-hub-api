import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the user',
    example: 'Kayki Letieri',
    required: true,
    type: 'string',
  })
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Email of the user',
    example: 'user@example.com',
    required: true,
    type: 'string',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Password of the user',
    example: 'password123',
    required: true,
    type: 'string',
  })
  password: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Class ID of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
    type: 'string',
  })
  classId: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Period ID of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
    type: 'string',
  })
  periodId: string;
}
