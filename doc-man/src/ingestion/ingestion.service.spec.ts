import { Test, TestingModule } from '@nestjs/testing';
import { IngestionService } from './ingestion.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ingestion } from './injestion.entity';
import { Repository } from 'typeorm';
import { AppService } from '../app.service';

// Mock the global fetch API
global.fetch = jest.fn() as jest.Mock;

// Mock AppService
jest.mock('../app.service', () => ({
  AppService: {
    getIngestionUrl: jest.fn().mockReturnValue('http://mockurl.com'),
  },
}));

// Create repository mock type with proper Jest mock methods
interface MockRepository {
  create: jest.Mock;
  save: jest.Mock;
  findOne: jest.Mock;
}

// Create mock repository factory
const createMockRepository = (): MockRepository => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
});

describe('IngestionService', () => {
  let service: IngestionService;
  let repository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestionService,
        {
          provide: getRepositoryToken(Ingestion),
          useFactory: createMockRepository,
        },
      ],
    }).compile();

    service = module.get<IngestionService>(IngestionService);
    repository = module.get<MockRepository>(getRepositoryToken(Ingestion));
    
    // Reset the mock before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('ingestData', () => {
    it('should successfully ingest data and update status', async () => {
      // Arrange
      const ingestionData = {
        fileName: 'test.pdf',
        fileType: 'application/pdf',
        filePath: '/path/to/file',
      } as Partial<Ingestion>;
      const createdIngestion = { id: 1, ...ingestionData, status: 'pending' } as Ingestion;
      const apiResponse = { status: 'processing', message: 'Processing started' };
      
      repository.create.mockReturnValue(createdIngestion);
      repository.save.mockResolvedValue(createdIngestion);
      
      (fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(apiResponse),
      });

      // Act
      const result = await service.ingestData(ingestionData);

      // Assert
      expect(repository.create).toHaveBeenCalledWith(ingestionData);
      expect(repository.save).toHaveBeenCalledTimes(2);
      expect(fetch).toHaveBeenCalledWith(
        'http://mockurl.com/ingestion', 
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ ...ingestionData, id: 1 }),
        })
      );
      expect(result).toEqual(apiResponse);
    });
  });

  describe('getIngestionStatus', () => {
    it('should fetch and update the ingestion status', async () => {
      // Arrange
      const ingestionId = '1';
      const existingIngestion = { id: 1, status: 'pending' } as Ingestion;
      const apiResponse = { status: 'completed', message: 'Processing completed' };
      
      repository.findOne.mockResolvedValue(existingIngestion);
      (fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(apiResponse),
      });

      // Act
      const result = await service.getIngestionStatus(ingestionId);

      // Assert
      expect(fetch).toHaveBeenCalledWith(
        'http://mockurl.com/status/1', 
        expect.objectContaining({ method: 'GET' })
      );
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repository.save).toHaveBeenCalledWith({ ...existingIngestion, status: 'completed' });
      expect(result).toEqual(apiResponse);
    });

    it('should throw an error if ingestion is not found', async () => {
      // Arrange
      const ingestionId = '999';
      repository.findOne.mockResolvedValue(null);
      (fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue({}),
      });

      // Act and Assert
      await expect(service.getIngestionStatus(ingestionId)).rejects.toThrow('Ingestion not found');
    });
  });

  describe('cancelIngestion', () => {
    it('should cancel the ingestion and update status', async () => {
      // Arrange
      const ingestionId = '1';
      const existingIngestion = { id: 1, status: 'processing' } as Ingestion;
      const updatedIngestion = { ...existingIngestion, status: 'cancelled' } as Ingestion;
      
      repository.findOne.mockResolvedValue(existingIngestion);
      repository.save.mockResolvedValue(updatedIngestion);
      (fetch as jest.Mock).mockResolvedValue({});

      // Act
      const result = await service.cancelIngestion(ingestionId);

      // Assert
      expect(fetch).toHaveBeenCalledWith(
        'http://mockurl.com/cancel/1', 
        expect.objectContaining({ method: 'GET' })
      );
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({ status: 'cancelled' }));
      expect(result).toEqual(updatedIngestion);
    });

    it('should throw an error if ingestion is not found', async () => {
      // Arrange
      const ingestionId = '999';
      repository.findOne.mockResolvedValue(null);
      (fetch as jest.Mock).mockResolvedValue({});

      // Act and Assert
      await expect(service.cancelIngestion(ingestionId)).rejects.toThrow('Ingestion not found');
    });
  });

  describe('pauseIngestion', () => {
    it('should pause the ingestion and update status', async () => {
      // Arrange
      const ingestionId = '1';
      const existingIngestion = { id: 1, status: 'processing' } as Ingestion;
      const updatedIngestion = { ...existingIngestion, status: 'paused' } as Ingestion;
      
      repository.findOne.mockResolvedValue(existingIngestion);
      repository.save.mockResolvedValue(updatedIngestion);
      (fetch as jest.Mock).mockResolvedValue({});

      // Act
      const result = await service.pauseIngestion(ingestionId);

      // Assert
      expect(fetch).toHaveBeenCalledWith(
        'http://mockurl.com/pause/1', 
        expect.objectContaining({ method: 'GET' })
      );
      expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({ status: 'paused' }));
      expect(result).toEqual(updatedIngestion);
    });
  });

  describe('resumeIngestion', () => {
    it('should resume the ingestion and update status', async () => {
      // Arrange
      const ingestionId = '1';
      const existingIngestion = { id: 1, status: 'paused' } as Ingestion;
      const updatedIngestion = { ...existingIngestion, status: 'resumed' } as Ingestion;
      
      repository.findOne.mockResolvedValue(existingIngestion);
      repository.save.mockResolvedValue(updatedIngestion);
      (fetch as jest.Mock).mockResolvedValue({});

      // Act
      const result = await service.resumeIngestion(ingestionId);

      // Assert
      expect(fetch).toHaveBeenCalledWith(
        'http://mockurl.com/resume/1', 
        expect.objectContaining({ method: 'GET' })
      );
      expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({ status: 'resumed' }));
      expect(result).toEqual(updatedIngestion);
    });
  });

  describe('retryIngestion', () => {
    it('should retry the ingestion and update status', async () => {
      // Arrange
      const ingestionId = '1';
      const existingIngestion = { id: 1, status: 'failed' } as Ingestion;
      const updatedIngestion = { ...existingIngestion, status: 'retried' } as Ingestion;
      
      repository.findOne.mockResolvedValue(existingIngestion);
      repository.save.mockResolvedValue(updatedIngestion);
      (fetch as jest.Mock).mockResolvedValue({});

      // Act
      const result = await service.retryIngestion(ingestionId);

      // Assert
      expect(fetch).toHaveBeenCalledWith(
        'http://mockurl.com/retry/1', 
        expect.objectContaining({ method: 'GET' })
      );
      expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({ status: 'retried' }));
      expect(result).toEqual(updatedIngestion);
    });
  });

  describe('getDocumentEmbedding', () => {
    it('should fetch document embedding', async () => {
      // Arrange
      const documentId = '1';
      const apiResponse = { embedding: [0.1, 0.2, 0.3] };
      
      (fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(apiResponse),
      });

      // Act
      const result = await service.getDocumentEmbedding(documentId);

      // Assert
      expect(fetch).toHaveBeenCalledWith(
        'http://mockurl.com/embedding/1', 
        expect.objectContaining({ method: 'GET' })
      );
      expect(result).toEqual(apiResponse);
    });
  });
}); 