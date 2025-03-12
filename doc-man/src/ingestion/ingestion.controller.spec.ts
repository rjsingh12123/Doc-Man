import { Test, TestingModule } from '@nestjs/testing';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';

describe('IngestionController', () => {
  let ingestionController: IngestionController;
  let ingestionService: IngestionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestionController],
      providers: [
        {
          provide: IngestionService,
          useValue: {
            ingestData: jest.fn(),
            getIngestionStatus: jest.fn(),
            cancelIngestion: jest.fn(),
            pauseIngestion: jest.fn(),
            resumeIngestion: jest.fn(),
            retryIngestion: jest.fn(),
            getDocumentEmbedding: jest.fn(),
          },
        },
      ],
    }).compile();

    ingestionController = module.get<IngestionController>(IngestionController);
    ingestionService = module.get<IngestionService>(IngestionService);
  });

  it('should ingest data', async () => {
    const data = { name: 'test', description: 'test' };
    jest.spyOn(ingestionService, 'ingestData').mockResolvedValue(data);

    expect(await ingestionController.ingestData(data)).toEqual(data);
  });

  it('should get ingestion status', async () => {
    const status = { status: 'processing' };
    jest.spyOn(ingestionService, 'getIngestionStatus').mockResolvedValue(status);

    expect(await ingestionController.getIngestionStatus('1')).toEqual(status);
  });

  it('should cancel ingestion', async () => {
    const status = { id: 1,status: 'cancelled' };
    jest.spyOn(ingestionService, 'cancelIngestion').mockResolvedValue(status);

    expect(await ingestionController.cancelIngestion('1')).toEqual(status);
  });

  it('should pause ingestion', async () => {
    const status = { id: 1,status: 'paused' };
    jest.spyOn(ingestionService, 'pauseIngestion').mockResolvedValue(status);

    expect(await ingestionController.pauseIngestion('1')).toEqual(status);
  });

  it('should resume ingestion', async () => {
    const result = { id: 1,status: 'resumed' };
    jest.spyOn(ingestionService, 'resumeIngestion').mockResolvedValue(result);

    expect(await ingestionController.resumeIngestion('1')).toEqual(result);
  });

  it('should retry ingestion', async () => {
    const result = { id: 1, status: 'retried' };
    jest.spyOn(ingestionService, 'retryIngestion').mockResolvedValue(result);

    expect(await ingestionController.retryIngestion('1')).toEqual(result);
  });

  it('should get document embedding', async () => {
    const embedding = { embedding: 'some-embedding-data' };
    jest.spyOn(ingestionService, 'getDocumentEmbedding').mockResolvedValue(embedding);

    expect(await ingestionController.getDocumentEmbedding('1')).toEqual(embedding);
  });
});
