import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { Document } from './document.entity';

describe('DocumentsController', () => {
  let documentsController: DocumentsController;
  let documentsService: DocumentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentsController],
      providers: [
        {
          provide: DocumentsService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            findAllPaginated: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    documentsController = module.get<DocumentsController>(DocumentsController);
    documentsService = module.get<DocumentsService>(DocumentsService);
  });

  it('should create a document', async () => {
    const documentData = { title: 'Test Document', description: 'Test Description' };
    const createdDocument: Document = {
      id: 1,
      metadata: { fileSize: 100, fileName: 'test.pdf', fileType: 'application/pdf', fileEncoding: 'utf-8' },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jest.spyOn(documentsService, 'create').mockResolvedValue(createdDocument);

    expect(await documentsController.upload(documentData as any)).toEqual(createdDocument);
  });

  it('should find a document by ID', async () => {
    const document: Document = {
      id: 1,
      metadata: { fileSize: 100, fileName: 'test.pdf', fileType: 'application/pdf', fileEncoding: 'utf-8' },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jest.spyOn(documentsService, 'findOne').mockResolvedValue(document);

    expect(await documentsController.findOne(1, {} as any)).toEqual(document);
  });

  it('should find all documents with pagination', async () => {
    const documents: Document[] = [{
      id: 1,
      metadata: { fileSize: 100, fileName: 'test.pdf', fileType: 'application/pdf', fileEncoding: 'utf-8' },
      createdAt: new Date(),
      updatedAt: new Date(),
    }];
    const total = 1;
    jest.spyOn(documentsService, 'findAllPaginated').mockResolvedValue([documents, total]);

    expect(await documentsController.findAll(1, 10)).toEqual({ data: documents, total });
  });

  it('should update a document', async () => {
    const documentData = { title: 'Updated Document', description: 'Updated Description' };
    const updatedDocument: Document = {
      id: 1,
      metadata: { fileSize: 100, fileName: 'test.pdf', fileType: 'application/pdf', fileEncoding: 'utf-8' },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jest.spyOn(documentsService, 'update').mockResolvedValue(updatedDocument);

    expect(await documentsController.update(1, documentData as any)).toEqual(updatedDocument);
  });

  it('should delete a document', async () => {
    jest.spyOn(documentsService, 'remove').mockResolvedValue(undefined);

    expect(await documentsController.remove(1)).toBeUndefined();
  });
});
