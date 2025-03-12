import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, JwtPayload } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { AppService } from 'src/app.service';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

const jwtOption: JwtSignOptions = { 
  expiresIn: '1h',
  secret: AppService.getJwtSecret(), 
  algorithm: 'HS256', 
  issuer: 'doc-man', 
  audience: 'doc-man'
};


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: AppService.getJwtSecret(),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findOneByUsername(payload.username);
    
    if (!user) {
      return null;
    }
    return { userId: user.id, username: user.username, roles: user.role }; // Ensure roles are included
  }

  signToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, jwtOption);
  }
}