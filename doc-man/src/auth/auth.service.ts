import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtStrategy } from './jwt.strategy';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtStrategy: JwtStrategy
  ) {}

  // Method to validate a user
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // Method for user login
  async login(user: any) {
    const userData = await this.validateUser(user.username, user.password);

    if (!userData) {
      return null;
    }
    const payload = { username: userData.username, sub: userData.userId };
    return {
      access_token: this.jwtStrategy.signToken(payload),
    };
  }

  // Method for user registration
  async register(userDto: any) {
    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    const user = await this.usersService.create({
      ...userDto,
      password: hashedPassword,
    });
    return user;
  }

  // Method for user logout
  async logout(logoutData: { username: string, access_token: string }) {
    console.log('User logged out:', logoutData.username);

    return { message: 'User logged out successfully' };
  }
}
