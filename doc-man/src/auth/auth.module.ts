import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { AppService } from 'src/app.service';
import { AuthController } from './auth.controller';
@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: AppService.getJwtSecret(),
      signOptions: { expiresIn: AppService.getJwtExpiresIn() },
    }),
  ],
  providers: [AuthService, JwtStrategy, AppService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
