import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthDto } from './dto/auth.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
  async login(@Body() authDto: AuthDto): Promise<LoginResponseDto> {
    return this.authService.login(authDto);
  }

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Registers a new user in the system with a class token.',
  })
  @ApiBody({
    type: RegisterDto,
    description: 'User details and class token for registration.',
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered and JWT token returned.',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Token may be invalid or user already exists.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
  })
  async register(@Body() registerDto: RegisterDto): Promise<LoginResponseDto> {
    return this.authService.register(registerDto);
  }
}
