import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Method to find a user by username
  async findOneByUsername(username: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { username } });
    return user || undefined;
  }

  // Method to create a new user
  async create(userDto: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userDto);
    return this.usersRepository.save(user);
  }

  // Method to find all users
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  // Method to find a user by ID
  async findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  // Method to update a user by ID
  async update(id: number, userData: Partial<User>): Promise<User | null> {
    await this.usersRepository.update(id, userData);
    return this.usersRepository.findOne({ where: { id } });
  }

  // Method to remove a user by ID
  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

}
