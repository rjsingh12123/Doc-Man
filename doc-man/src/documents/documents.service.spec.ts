import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from './documents.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Document } from './document.entity';
import { Repository } from 'typeorm';

// Create repository mock type with proper Jest mock methods
interface MockRepository {
  create: jest.Mock;
  save: jest.Mock;
  find: jest.Mock;
  findOne: jest.Mock;
  update: jest.Mock;
  delete: jest.Mock;
  findAndCount: jest.Mock;
}

// Create mock repository factory
const createMockRepository = (): MockRepository => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findAndCount: jest.fn(),
});

describe('DocumentsService', () => {
  let service: DocumentsService;
  let repository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        {
          provide: getRepositoryToken(Document),
          useFactory: createMockRepository,
        },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
    repository = module.get<MockRepository>(getRepositoryToken(Document));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a document', async () => {
      // Arrange
      const documentData = {
        title: 'Test Document',
        content: 'Test Content',
      } as Partial<Document>;
      const expectedDocument = { id: 1, ...documentData } as Document;
      
      repository.create.mockReturnValue(expectedDocument);
      repository.save.mockResolvedValue(expectedDocument);

      // Act
      const result = await service.create(documentData);

      // Assert
      expect(repository.create).toHaveBeenCalledWith(documentData);
      expect(repository.save).toHaveBeenCalledWith(expectedDocument);
      expect(result).toEqual(expectedDocument);
    });
  });

  describe('findAll', () => {
    it('should return an array of documents', async () => {
      // Arrange
      const expectedDocuments = [
        { id: 1, metadata: { fileSize: 100, fileName: 'Document 1', fileType: 'text/plain', fileEncoding: 'utf-8' }, createdAt: new Date(), updatedAt: new Date() },
        { id: 2, metadata: { fileSize: 200, fileName: 'Document 2', fileType: 'application/pdf', fileEncoding: 'utf-8' }, createdAt: new Date(), updatedAt: new Date() },
      ] as Document[];
      repository.find.mockResolvedValue(expectedDocuments);

      // Act
      const result = await service.findAll();

      // Assert
      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(expectedDocuments);
    });
  });

  describe('findOne', () => {
    it('should return a document by id', async () => {
      // Arrange
      const documentId = 1;
      const expectedDocument = { id: documentId, metadata: { fileSize: 100, fileName: 'Document 1', fileType: 'text/plain', fileEncoding: 'utf-8' }, createdAt: new Date(), updatedAt: new Date() } as Document;
      repository.findOne.mockResolvedValue(expectedDocument);

      // Act
      const result = await service.findOne(documentId);

      // Assert
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: documentId } });
      expect(result).toEqual(expectedDocument);
    });

    it('should return null if document not found', async () => {
      // Arrange
      const documentId = 999;
      repository.findOne.mockResolvedValue(null);

      // Act
      const result = await service.findOne(documentId);

      // Assert
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: documentId } });
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update and return a document', async () => {
      // Arrange
      const documentId = 1;
      const updateData = { title: 'Updated Document' } as Partial<Document>;
      const updatedDocument = { id: documentId, metadata: { fileSize: 100, fileName: 'Document 1', fileType: 'text/plain', fileEncoding: 'utf-8' }, createdAt: new Date(), updatedAt: new Date() } as Document;
      
      repository.update.mockResolvedValue({ affected: 1 });
      repository.findOne.mockResolvedValue(updatedDocument);

      // Act
      const result = await service.update(documentId, updateData);

      // Assert
      expect(repository.update).toHaveBeenCalledWith(documentId, updateData);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: documentId } });
      expect(result).toEqual(updatedDocument);
    });

    it('should return null if document to update not found', async () => {
      // Arrange
      const documentId = 999;
      const updateData = { title: 'Updated Document' } as Partial<Document>;
      
      repository.update.mockResolvedValue({ affected: 0 });
      repository.findOne.mockResolvedValue(null);

      // Act
      const result = await service.update(documentId, updateData);

      // Assert
      expect(repository.update).toHaveBeenCalledWith(documentId, updateData);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: documentId } });
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should remove a document by id', async () => {
      // Arrange
      const documentId = 1;
      repository.delete.mockResolvedValue({ affected: 1 });

      // Act
      await service.remove(documentId);

      // Assert
      expect(repository.delete).toHaveBeenCalledWith(documentId);
    });
  });

  describe('findAllPaginated', () => {
    it('should return paginated documents with total count', async () => {
      // Arrange
      const page = 1;
      const pageSize = 10;
      const expectedDocuments = [
        { id: 1, metadata: { fileSize: 100, fileName: 'Document 1', fileType: 'text/plain', fileEncoding: 'utf-8' }, createdAt: new Date(), updatedAt: new Date() },
        { id: 2, metadata: { fileSize: 200, fileName: 'Document 2', fileType: 'application/pdf', fileEncoding: 'utf-8' }, createdAt: new Date(), updatedAt: new Date() },
      ] as Document[];
      const expectedTotal = 2;
      
      repository.findAndCount.mockResolvedValue([expectedDocuments, expectedTotal]);

      // Act
      const [documents, total] = await service.findAllPaginated(page, pageSize);

      // Assert
      expect(repository.findAndCount).toHaveBeenCalledWith({
        skip: (page - 1) * pageSize,
        take: pageSize,
      });
      expect(documents).toEqual(expectedDocuments);
      expect(total).toEqual(expectedTotal);
    });
  });
}); 