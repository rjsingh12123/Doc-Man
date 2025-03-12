import { Controller, Post, Body, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User, UserPermissions, UserRole } from '../users/user.entity';
import { ApiOperation, ApiBody, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Registration endpoint
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
        email: { type: 'string' , format: 'email'},
        phone: { type: 'string' , format: 'phone'},
        permissions: { 
            type: 'array', 
            default: [UserPermissions.ALL],
            enum: Object.values(UserPermissions)
        },
        role: { 
            type: 'string', 
            default: UserRole.USER,
            enum: Object.values(UserRole)
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async register(@Body() userData: Partial<User>) {

    if(!userData.username || !userData.password) {
        throw new BadRequestException('Username and password are required');
    }
    
    if (userData.role && (userData.role === UserRole.ADMIN || userData.role === UserRole.EDITOR)) {
        throw new BadRequestException('Admin or Editor registration is not allowed');
    }   

    if (userData.role && !Object.values(UserRole).includes(userData.role)) {
        throw new BadRequestException('Invalid role');
    }

    if(!userData.role) {
        userData.role = UserRole.USER;
    }

    if(!userData.permissions) {
        userData.permissions = [UserPermissions.ALL];
    }

    try {
        this.authService.register(userData);
    } catch (error) {
        throw new BadRequestException('User registration failed');
    }

    return { message: 'User registered successfully' };
  }

  // Login endpoint
  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async login(@Body() loginData: { username: string; password: string }): Promise<{ access_token: string }> {

    if(!loginData.username || !loginData.password) {
        throw new BadRequestException('Username and password are required');
    }

    let token;

    try {
        token = await this.authService.login(loginData);
    } catch (error) {
        throw new UnauthorizedException('Invalid credentials');
    }

    if(!token) {
        throw new UnauthorizedException('Invalid credentials');
    }

    return token;
  }

  // Logout endpoint
  @Post('logout')
  @ApiOperation({ summary: 'Logout a user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        access_token: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'User logged out successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async logout(@Body() logoutData: { username: string, access_token: string }): Promise<void> {
    this.authService.logout(logoutData);
    return;
  }
}
