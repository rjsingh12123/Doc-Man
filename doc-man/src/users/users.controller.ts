import { Controller, Get, Post, Put, Delete, Body, Param, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserPermissions, UserRole } from './user.entity';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { ApiOperation, ApiBody, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


// Admin-only functionality for managing user roles and permissions.
// Only admin can create, update and delete users.
// Only admin can get all users.
// Only admin can get a user by ID.
// Only admin can update a user by ID.
// Only admin can delete a user by ID.

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //endpoint to change user Role
  @Post(':id/role')
  @ApiOperation({ summary: 'Change user role' })
  @ApiResponse({ status: 200, description: 'User role changed successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async changeRole(@Param('id') id: number, @Body() userData: Partial<User>): Promise<User | null> {

    if(!userData || !userData.role) {
      throw new BadRequestException('Role is required');
    }

    if(!Object.values(UserRole).includes(userData.role)) {
      throw new BadRequestException('Invalid role');
    }

    let user;
    try {
      user = await this.usersService.update(id, {role: userData.role});
    } catch (error) {
      throw new BadRequestException('Failed to change role');
    }

    if(!user) {
      throw new BadRequestException('Failed to change role');
    }

    return user;
  }

    //endpoint to change user Role
  @Post(':id/permissions')
  @ApiOperation({ summary: 'Change user permissions' })
  @ApiResponse({ status: 200, description: 'User permissions changed successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async changePermissions(@Param('id') id: number, @Body() userData: Partial<User>): Promise<User | null> {

    if(!userData || !userData.permissions) {
      throw new BadRequestException('Permissions are required');
    }

    if(!userData.permissions.every(permission => Object.values(UserPermissions).includes(permission))) {
      throw new BadRequestException('Invalid permissions', { cause: userData.permissions });
    }

    let user;
    try {
      user = await this.usersService.update(id, {permissions: userData.permissions});
    } catch (error) {
      throw new BadRequestException('Failed to change role');
    }

    if(!user) {
      throw new BadRequestException('Failed to change role');
    }

    return user;
  }

  // Create a new user
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: User })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(@Body() userData: Partial<User>): Promise<User> {

    if(!userData) {
      throw new BadRequestException('User data is required');
    }

    let user;
    try {
      user = await this.usersService.create(userData);
    } catch (error) {
      throw new BadRequestException('Failed to create user', error);
    }

    if(!user) {
      throw new BadRequestException('Failed to create user');
    }
    
    return user;
  }

  // Get all users
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async findAll(): Promise<User[]> {
    let users;
    try {
      users = await this.usersService.findAll();
    } catch (error) {
      throw new BadRequestException('Failed to get users', error);
    }
    
    return users;
  }

  // Get a user by ID
  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'Return the user' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: number): Promise<User | null> {
    let user;
    try {
      user = await this.usersService.findOne(id);
    } catch (error) {
      throw new BadRequestException('Failed to get user', error);
    }

    if(!user) {
      throw new BadRequestException('User not found');
    }
    
    return user;
  }

  // Update a user by ID
  @Put(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(@Param('id') id: number, @Body() userData: Partial<User>): Promise<User | null> {
    if(!userData) {
      throw new BadRequestException('User data is required');
    }

    let user;
    try {
      user = await this.usersService.update(id, userData);
    } catch (error) {
      throw new BadRequestException('Failed to update user', error);
    }

    if(!user) {
      throw new BadRequestException('Failed to update user');
    }

    return user;
  }

  // Delete a user by ID
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id') id: number): Promise<{msg: string}> {
    
    try {
      await this.usersService.remove(id);
    } catch (error) {
      throw new BadRequestException('Failed to delete user', error);
    }

    return { msg: 'User deleted successfully' };
  }
}
