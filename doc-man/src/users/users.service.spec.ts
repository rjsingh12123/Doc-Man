import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserRole, UserPermissions } from './user.entity';
import { Repository } from 'typeorm';

// Create repository mock type with proper Jest mock methods
interface MockRepository {
  create: jest.Mock;
  save: jest.Mock;
  find: jest.Mock;
  findOne: jest.Mock;
  update: jest.Mock;
  delete: jest.Mock;
}

// Create mock repository factory
const createMockRepository = (): MockRepository => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let repository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: createMockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<MockRepository>(getRepositoryToken(User));
    
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneByUsername', () => {
    it('should return a user when user exists', async () => {
      // Arrange
      const username = 'testuser';
      const expectedUser = { 
        id: 1, 
        username, 
        password: 'hashedpassword',
        role: UserRole.USER,
        permissions: [UserPermissions.READ],
        email: 'test@example.com',
        phone: '+1234567890'
      } as User;
      
      repository.findOne.mockResolvedValue(expectedUser);

      // Act
      const result = await service.findOneByUsername(username);

      // Assert
      expect(repository.findOne).toHaveBeenCalledWith({ where: { username } });
      expect(result).toEqual(expectedUser);
    });

    it('should return undefined when user does not exist', async () => {
      // Arrange
      const username = 'nonexistentuser';
      repository.findOne.mockResolvedValue(null);

      // Act
      const result = await service.findOneByUsername(username);

      // Assert
      expect(repository.findOne).toHaveBeenCalledWith({ where: { username } });
      expect(result).toBeUndefined();
    });
  });

  describe('create', () => {
    it('should successfully create a user', async () => {
      // Arrange
      const userDto = {
        username: 'newuser',
        password: 'password123',
        role: UserRole.USER,
        permissions: [UserPermissions.READ],
        email: 'new@example.com',
        phone: '+9876543210'
      } as Partial<User>;
      
      const createdUser = { id: 1, ...userDto } as User;
      
      repository.create.mockReturnValue(createdUser);
      repository.save.mockResolvedValue(createdUser);

      // Act
      const result = await service.create(userDto);

      // Assert
      expect(repository.create).toHaveBeenCalledWith(userDto);
      expect(repository.save).toHaveBeenCalledWith(createdUser);
      expect(result).toEqual(createdUser);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      // Arrange
      const expectedUsers = [
        { id: 1, username: 'user1', role: UserRole.ADMIN },
        { id: 2, username: 'user2', role: UserRole.USER },
      ] as User[];
      
      repository.find.mockResolvedValue(expectedUsers);

      // Act
      const result = await service.findAll();

      // Assert
      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(expectedUsers);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      // Arrange
      const userId = 1;
      const expectedUser = { 
        id: userId, 
        username: 'testuser', 
        role: UserRole.USER 
      } as User;
      
      repository.findOne.mockResolvedValue(expectedUser);

      // Act
      const result = await service.findOne(userId);

      // Assert
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(result).toEqual(expectedUser);
    });

    it('should return null if user not found', async () => {
      // Arrange
      const userId = 999;
      repository.findOne.mockResolvedValue(null);

      // Act
      const result = await service.findOne(userId);

      // Assert
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update and return a user', async () => {
      // Arrange
      const userId = 1;
      const updateData = { 
        email: 'updated@example.com',
        role: UserRole.EDITOR
      } as Partial<User>;
      
      const updatedUser = { 
        id: userId, 
        username: 'testuser', 
        email: 'updated@example.com',
        role: UserRole.EDITOR
      } as User;
      
      repository.update.mockResolvedValue({ affected: 1 });
      repository.findOne.mockResolvedValue(updatedUser);

      // Act
      const result = await service.update(userId, updateData);

      // Assert
      expect(repository.update).toHaveBeenCalledWith(userId, updateData);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(result).toEqual(updatedUser);
    });

    it('should return null if user to update not found', async () => {
      // Arrange
      const userId = 999;
      const updateData = { email: 'updated@example.com' } as Partial<User>;
      
      repository.update.mockResolvedValue({ affected: 0 });
      repository.findOne.mockResolvedValue(null);

      // Act
      const result = await service.update(userId, updateData);

      // Assert
      expect(repository.update).toHaveBeenCalledWith(userId, updateData);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should remove a user by id', async () => {
      // Arrange
      const userId = 1;
      repository.delete.mockResolvedValue({ affected: 1 });

      // Act
      await service.remove(userId);

      // Assert
      expect(repository.delete).toHaveBeenCalledWith(userId);
    });
  });
}); 