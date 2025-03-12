import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { MockService } from './mock.service';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { ApiOperation } from '@nestjs/swagger';

@Controller('')
export class IngestionController {
  constructor(private readonly mockService: MockService) {}

  @Post('ingestion')
  @ApiOperation({ summary: 'Start ingestion process' })
  @ApiBody({ schema: { type: 'object', properties: { id: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'Ingestion started' })
  startIngestion(@Body() data: any): Promise<{ status: string }> {
    const id = data.id;
    this.mockService.startIngestion(id);
    return Promise.resolve({ status: this.mockService.getStatus(id) });
  }

  @Get('cancel/:id')
  @ApiOperation({ summary: 'Cancel ingestion process' })
  @ApiBody({ schema: { type: 'object', properties: { id: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'Ingestion cancelled' })
  cancelIngestion(@Param('id') id: string): Promise<{ status: string }> {
    this.mockService.cancelIngestion(id);
    return Promise.resolve({ status: this.mockService.getStatus(id) });
  }

  @Get('pause/:id')
  @ApiOperation({ summary: 'Pause ingestion process' })
  @ApiBody({ schema: { type: 'object', properties: { id: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'Ingestion paused' })
  pauseIngestion(@Param('id') id: string): Promise<{ status: string }> {
    this.mockService.pauseIngestion(id);
    return Promise.resolve({ status: this.mockService.getStatus(id) });
  }

  @Get('resume/:id')
  @ApiOperation({ summary: 'Resume ingestion process' })
  @ApiBody({ schema: { type: 'object', properties: { id: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'Ingestion resumed' })
  resumeIngestion(@Param('id') id: string): Promise<{ status: string }> {
    this.mockService.resumeIngestion(id);
    return Promise.resolve({ status: this.mockService.getStatus(id) });
  }

  @Get('retry/:id')
  @ApiOperation({ summary: 'Retry ingestion process' })
  @ApiBody({ schema: { type: 'object', properties: { id: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'Ingestion retried' })
  retryIngestion(@Param('id') id: string): Promise<{ status: string }> {
    this.mockService.retryIngestion(id);
    return Promise.resolve({ status: this.mockService.getStatus(id) });
  }
} 