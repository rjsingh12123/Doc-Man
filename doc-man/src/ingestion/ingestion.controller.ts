import { Controller, Get, Post, Put, Delete, Body, Param, BadRequestException } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IngestionService } from './ingestion.service'; 

@ApiBearerAuth()
@ApiTags('ingestion')
@Controller('ingestion')
// @UseGuards(JwtAuthGuard)
export class IngestionController {

  constructor(private readonly ingestionService: IngestionService) {}

  // endpoint which will call the ingestion
  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        data: { type: 'object', 
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: 'Ingest data' })
  @ApiResponse({ status: 200, description: 'Document ingested successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async ingestData(@Body() data: any) {
    data.status = 'processing';
    return this.ingestionService.ingestData(data);
  }

  // endpoint which will call the ingestion status
  @Get(':id/status')
  @ApiOperation({ summary: 'Get ingestion status' })
  @ApiResponse({ status: 200, description: 'Ingestion status' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async getIngestionStatus(@Param('id') id: string) {
    return this.ingestionService.getIngestionStatus(id);
  }

  // endpoint which will call the ingestion cancel
  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel ingestion' })
  @ApiResponse({ status: 200, description: 'Ingestion canceled' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async cancelIngestion(@Param('id') id: string) {
    return this.ingestionService.cancelIngestion(id);
  }

  // endpoint which will call the ingestion pause
  @Post(':id/pause')
  @ApiOperation({ summary: 'Pause ingestion' })
  @ApiResponse({ status: 200, description: 'Ingestion paused' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async pauseIngestion(@Param('id') id: string) {
    return this.ingestionService.pauseIngestion(id);
  }

  // endpoint which will call the ingestion resume
  @Post(':id/resume')
  @ApiOperation({ summary: 'Resume ingestion' })
  @ApiResponse({ status: 200, description: 'Ingestion resumed' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async resumeIngestion(@Param('id') id: string) {
    return this.ingestionService.resumeIngestion(id);
  }

  // endpoint ehich will retry the failed ingestion
  @Post(':id/retry')
  @ApiOperation({ summary: 'Retry ingestion' })
  @ApiResponse({ status: 200, description: 'Ingestion retried' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async retryIngestion(@Param('id') id: string) {
    return this.ingestionService.retryIngestion(id);
  }

  // create endpoint to get the document embeding
  @Get(':id/embed')
  @ApiOperation({ summary: 'Get document embedding' })
  @ApiResponse({ status: 200, description: 'Document embedding' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async getDocumentEmbedding(@Param('id') id: string) {
    return this.ingestionService.getDocumentEmbedding(id);
  }

}