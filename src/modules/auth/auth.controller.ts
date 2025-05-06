import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthDto } from './dto/auth.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';
import { LoginResponseDto } from './dto/login-response.dto';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({
    summary: 'Login user',
    description: 'Login user with email and password.',
  })
  @ApiBody({
    type: AuthDto,
    description: 'User credentials for login.',
  })
  @Public()
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully.',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid credentials.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async login(@Body() authDto: AuthDto)
    : Promise<LoginResponseDto> {
    return this.authService.login(authDto);
  }
}
