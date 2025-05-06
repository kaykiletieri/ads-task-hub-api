import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';

@Controller('users')
@ApiTags('Users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ) { }

    @Post()
    @ApiOperation({
        summary: 'Create a new user',
        description: 'Creates a new user in the system.',
    })
    @ApiBody({
        type: CreateUserDto,
        description: 'User data to create a new user.',
    })
    @ApiResponse({
        status: 201,
        description: 'User created successfully.',
        type: UserResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request. User already exists.',
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error.',
    })
    async createUser(
        @Body() createUserDto: CreateUserDto,
    )
        : Promise<UserResponseDto> {
        return this.usersService.createUser(createUserDto);
    }
}
