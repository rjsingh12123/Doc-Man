import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserPermissions, UserRole } from 'src/users/user.entity';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            logout: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should register a user', async () => {
    const userData = { username: 'test', password: 'test', email: 'test@test.com', phone: '1234567890', role: UserRole.USER, permissions: [UserPermissions.READ], id: 1 };
    jest.spyOn(authService, 'register').mockResolvedValue(userData);

    expect(await authController.register(userData)).toEqual({
      message: 'User registered successfully',
    });
  });

  it('should login a user', async () => {
    const loginData = { username: 'test', password: 'test' };
    const token = { access_token: 'token' };
    jest.spyOn(authService, 'login').mockResolvedValue(token);

    expect(await authController.login(loginData)).toEqual(token);
  });

  it('should logout a user', async () => {
    const logoutData = { username: 'test', access_token: 'token' };
    jest.spyOn(authService, 'logout').mockResolvedValue({ message: 'Logged out successfully' });

    expect(await authController.logout(logoutData)).toEqual({ message: 'Logged out successfully' });
  });
});
