import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ClassTokenService } from "../services/class-token.service";
import { Roles } from "../../auth/decorators/role.decorator";
import { ClassToken } from "../entities/class-token.entity";
import { PaginationQueryDto } from "src/common/dtos/pagination-query.dto";

@Controller('class-tokens')
@ApiTags('Class Tokens')
export class ClassTokensController {
    constructor(private readonly classTokenService: ClassTokenService) { }

    @Get('class/:id')
    @Roles('admin', 'coordinator')
    @ApiOperation({ summary: 'Get all tokens for a specific class' })
    @ApiParam({ name: 'id', type: String, description: 'Class ID' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'order_by', required: false, type: String })
    @ApiQuery({ name: 'order_direction', required: false, enum: ['ASC', 'DESC'] })
    async getClassTokens(@Param('id', new ParseUUIDPipe()) id: string, @Query() query: PaginationQueryDto): Promise<{ data: ClassToken[]; total: number }> {
        return this.classTokenService.getActiveClassTokensByClassPaginated(id, query);
    }

    @Get()
    @Roles('admin', 'coordinator')
    @ApiOperation({ summary: 'Get all active class tokens with pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'order_by', required: false, type: String })
    @ApiQuery({ name: 'order_direction', required: false, enum: ['ASC', 'DESC'] })
    @ApiResponse({ status: 200, type: ClassToken, isArray: true })
    async getActiveClassTokens(
        @Query() query: PaginationQueryDto,
    ): Promise<{ data: ClassToken[]; total: number }> {
        return this.classTokenService.getActiveClassTokensPaginated(query);
    }

    @Post(':id/generate')
    @Roles('admin')
    @ApiOperation({ summary: 'Generate a class token' })
    @ApiParam({ name: 'id', type: String, description: 'Class ID' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: { expirationDate: { type: 'string', format: 'date-time' } },
            required: ['expirationDate'],
        },
    })
    @ApiResponse({ status: 201 })
    async generateClassToken(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body('expirationDate') expirationDate: string,
    ): Promise<ClassToken> {
        return this.classTokenService.generateClassToken(
            id,
            new Date(expirationDate),
        );
    }
}