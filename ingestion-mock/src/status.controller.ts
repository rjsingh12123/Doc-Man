import { Controller, Get, Param } from '@nestjs/common';
import { MockService } from './mock.service';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
@Controller('status')
export class StatusController {
  constructor(private readonly mockService: MockService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get status for a given ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'The ID of the status to retrieve' })
  @ApiResponse({ status: 200, description: 'The status for the given ID' })
  getStatus(@Param('id') id: string): Promise<{ status: string }> {
    return Promise.resolve({ status: this.mockService.getStatus(id) });
  }
} 