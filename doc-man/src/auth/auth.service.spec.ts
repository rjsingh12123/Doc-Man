import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtStrategy } from './jwt.strategy';
import * as bcrypt from 'bcrypt';
import { UserRole, UserPermissions, User } from '../users/user.entity';

// Mock bcrypt
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

// Type for JwtStrategy mock
type MockedJwtStrategy = {
  signToken: jest.Mock;
};

// Type for UsersService mock
type MockedUsersService = {
  findOneByUsername: jest.Mock;
  create: jest.Mock;
};

describe('AuthService', () => {
  let service: AuthService;
  let usersService: MockedUsersService;
  let jwtStrategy: MockedJwtStrategy;

  const mockUser = {
    id: 1,
    username: 'testuser',
    password: 'hashedpassword',
    role: UserRole.USER,
    permissions: [UserPermissions.READ],
    email: 'test@example.com',
    phone: '+1234567890'
  } as User;

  beforeEach(async () => {
    // Create mocks
    usersService = {
      findOneByUsername: jest.fn(),
      create: jest.fn(),
    };

    jwtStrategy = {
      signToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: usersService,
        },
        {
          provide: JwtStrategy,
          useValue: jwtStrategy,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    // Reset mocks after each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user data (without password) when credentials are valid', async () => {
      // Arrange
      usersService.findOneByUsername.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      // Act
      const result = await service.validateUser('testuser', 'password123');

      // Assert
      expect(usersService.findOneByUsername).toHaveBeenCalledWith('testuser');
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword');
      expect(result).toEqual(expect.objectContaining({
        id: mockUser.id,
        username: mockUser.username,
        role: mockUser.role,
      }));
      expect(result.password).toBeUndefined();
    });

    it('should return null when user does not exist', async () => {
      // Arrange
      usersService.findOneByUsername.mockResolvedValue(undefined);

      // Act
      const result = await service.validateUser('nonexistentuser', 'password123');

      // Assert
      expect(usersService.findOneByUsername).toHaveBeenCalledWith('nonexistentuser');
      expect(result).toBeNull();
    });

    it('should return null when password is incorrect', async () => {
      // Arrange
      usersService.findOneByUsername.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act
      const result = await service.validateUser('testuser', 'wrongpassword');

      // Assert
      expect(usersService.findOneByUsername).toHaveBeenCalledWith('testuser');
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedpassword');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token when credentials are valid', async () => {
      // Arrange
      const loginCredentials = { username: 'testuser', password: 'password123' };
      const userWithoutPassword = { ...mockUser } as Partial<User>;
      // Use property assignment instead of delete
      userWithoutPassword.password = undefined;
      
      jest.spyOn(service, 'validateUser').mockResolvedValue(userWithoutPassword as any);
      jwtStrategy.signToken.mockReturnValue('test-jwt-token');

      // Act
      const result = await service.login(loginCredentials);

      // Assert
      expect(service.validateUser).toHaveBeenCalledWith(loginCredentials.username, loginCredentials.password);
      expect(jwtStrategy.signToken).toHaveBeenCalled();
      expect(result).toEqual({ access_token: 'test-jwt-token' });
    });

    it('should return null when credentials are invalid', async () => {
      // Arrange
      const loginCredentials = { username: 'testuser', password: 'wrongpassword' };
      
      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      // Act
      const result = await service.login(loginCredentials);

      // Assert
      expect(service.validateUser).toHaveBeenCalledWith(loginCredentials.username, loginCredentials.password);
      expect(jwtStrategy.signToken).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('register', () => {
    it('should hash password and create a new user', async () => {
      // Arrange
      const registerDto = {
        username: 'newuser',
        password: 'password123',
        role: UserRole.USER,
        permissions: [UserPermissions.READ],
        email: 'new@example.com',
        phone: '+9876543210'
      } as Partial<User>;
      
      const hashedPassword = 'hashed-password-123';
      const createdUser = { id: 2, ...registerDto, password: hashedPassword } as User;
      
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      usersService.create.mockResolvedValue(createdUser);

      // Act
      const result = await service.register(registerDto);

      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(usersService.create).toHaveBeenCalledWith({
        ...registerDto,
        password: hashedPassword,
      });
      expect(result).toEqual(createdUser);
    });
  });

  describe('logout', () => {
    it('should log out a user successfully', async () => {
      // Arrange
      const logoutData = { username: 'testuser', access_token: 'test-token' };
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Act
      const result = await service.logout(logoutData);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith('User logged out:', logoutData.username);
      expect(result).toEqual({ message: 'User logged out successfully' });
      
      // Clean up
      consoleSpy.mockRestore();
    });
  });
}); 