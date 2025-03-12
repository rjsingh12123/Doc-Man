import { Controller, Get, Param } from '@nestjs/common';
import { MockService } from './mock.service';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('embedding')
export class EmbeddingController {
  constructor(private readonly mockService: MockService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get embedding for a given ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'The ID of the embedding to retrieve' })
  @ApiResponse({ status: 200, description: 'The embedding for the given ID' })
  getEmbedding(@Param('id') id: string): number[] {
    return this.mockService.getEmbedding(id);
  }
} 