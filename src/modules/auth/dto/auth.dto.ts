import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({
    example: 'joaosilva@example.com',
    description: 'Email do usuário',
    required: true,
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Senha do usuário',
    required: true,
    type: String,
  })
  @IsString()
  @MinLength(4)
  password: string;
}
