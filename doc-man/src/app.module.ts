import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DocumentsModule } from './documents/documents.module';
import { IngestionModule } from './ingestion/ingestion.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
        type: AppService.getDbType() as any,
        host: AppService.getDbHost(),
        port: AppService.getDbPort(),
        username: AppService.getDbUsername(),
        password: AppService.getDbPassword(),
        database: AppService.getDb(),
        autoLoadEntities: true,
        synchronize: true,
      }),
      AuthModule,
    UsersModule,
    DocumentsModule,
    IngestionModule,    
  ],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {}