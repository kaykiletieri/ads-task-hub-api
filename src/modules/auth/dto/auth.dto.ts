import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({
    example: 'letieri.dev@gmail.com',
    description: 'User email',
    required: true,
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'User password',
    required: true,
    type: String,
  })
  @IsString()
  @MinLength(4)
  password: string;
}
