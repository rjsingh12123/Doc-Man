import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './document.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
  ) {}

  // Method to create a new document
  async create(documentData: Partial<Document>): Promise<Document> {
    const document = this.documentsRepository.create(documentData);
    return this.documentsRepository.save(document);
  }

  // Method to find all documents
  async findAll(): Promise<Document[]> {
    return this.documentsRepository.find();
  }

  // Method to find a document by ID
  async findOne(id: number): Promise<Document | null> {
    return this.documentsRepository.findOne({ where: { id } });
  }

  // Method to update a document by ID
  async update(id: number, documentData: Partial<Document>): Promise<Document | null> {
    await this.documentsRepository.update(id, documentData);
    return this.documentsRepository.findOne({ where: { id } });
  }

  // Method to remove a document by ID
  async remove(id: number): Promise<void> {
    await this.documentsRepository.delete(id);
  }

  // Method to find all documents with pagination
  async findAllPaginated(page: number, pageSize: number): Promise<[Document[], number]> {
    const [data, total] = await this.documentsRepository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return [data, total];
  }
}
