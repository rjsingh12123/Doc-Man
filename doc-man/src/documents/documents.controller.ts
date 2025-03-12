import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, UploadedFile, UseInterceptors, NotFoundException, Res } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiConsumes, ApiBody, ApiQuery } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { Document } from './document.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import * as Multer from 'multer';
import { Client } from 'minio';
import { Response } from 'express';

const minioClient = new Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: 'admin',
    secretKey: 'password123',
  });


@ApiTags('documents')
@ApiBearerAuth()
@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  // Upload a new document
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a new document' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        }
      },
    },
  })
  @ApiResponse({ status: 201, description: 'The document has been successfully uploaded.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async upload(@UploadedFile() file: Multer.File): Promise<Document> {

    const documentData: Partial<Document> = {
      metadata: {
        fileName: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size,
        fileEncoding: file.encoding,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const document = await this.documentsService.create(documentData);

    await minioClient.putObject('docman', document.id.toString(), file.buffer);

    return document;
  }

  // Update an existing document
  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update an existing document' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        }
      },
    },
  })
  @ApiResponse({ status: 201, description: 'The document has been successfully updated.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Document not found.' })
  async update(@Param('id') id: number,@UploadedFile() file: Multer.File): Promise<Document> {

    await minioClient.putObject('docman', id.toString(), file.buffer);

    const documentData: Partial<Document> = {
      metadata: {
        fileName: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size,
        fileEncoding: file.encoding,
      },
      updatedAt: new Date(),
    };
    const updatedDocument = await this.documentsService.update(id, documentData);
    if (!updatedDocument) {
      throw new NotFoundException('Document not found');
    }
    return updatedDocument;
  }

  // Retrieve a single document by ID
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a document by ID' })
  @ApiResponse({ status: 200, description: 'Return the document.' })
  @ApiResponse({ status: 404, description: 'Document not found.' })
  async findOne(@Param('id') id: number,@Res() res: Response) {
      
    const fileMeta = await this.documentsService.findOne(id);
      
    if (!fileMeta) {
        throw new NotFoundException('Document not found');
    }
        
    try {
        const fileStream = await minioClient.getObject('docman', id.toString());

      // Set response headers for download
      res.setHeader('Content-Disposition', `attachment; filename="${fileMeta.metadata.fileName}"`);
      res.setHeader('Content-Type', 'application/octet-stream');

      // Pipe the file stream to the response
      fileStream.pipe(res);
    } catch (error) {
        if (error.code === 'NoSuchKey') {
            throw new NotFoundException('Document not found');
        }
        throw error;
    }
  }

  // Get a list of documents with pagination
  @Get()
  @ApiOperation({ summary: 'Get a list of documents with pagination' })
  @ApiResponse({ status: 200, description: 'Return paginated list of documents.' })
  @ApiQuery({ name: 'page', type: Number, required: false, default: 1 })
  @ApiQuery({ name: 'pageSize', type: Number, required: false, default: 10 })
  async findAll(@Query('page') page: number = 1, @Query('pageSize') pageSize: number = 10): Promise<{ data: Document[]; total: number }> {
    const [data, total] = await this.documentsService.findAllPaginated(page, pageSize);
    return { data, total };
  }

  // Delete a document by ID
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a document by ID' })
  @ApiResponse({ status: 200, description: 'The document has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Document not found.' })
  async remove(@Param('id') id: number): Promise<void> {

    try {
        await minioClient.removeObject('docman', id.toString());
        return this.documentsService.remove(id);
    } catch (error) {
        if (error.code === 'NoSuchKey') {
            throw new NotFoundException('Document not found');
        }
        throw error;
    }
  }
}