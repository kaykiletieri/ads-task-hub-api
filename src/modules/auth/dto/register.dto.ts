import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class RegisterDto {
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
    example: 'letieri.dev@gmail.com',
    required: true,
    type: 'string',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Password of the user',
    example: '123456',
    required: true,
    type: 'string',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Token for class registration',
    example: 'T01E01-2023-12K31',
    required: true,
    type: 'string',
  })
  class_token: string;
}
