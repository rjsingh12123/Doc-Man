import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MockService } from './mock.service';
import { IngestionController } from './ingestion.controller';
import { StatusController } from './status.controller';
import { EmbeddingController } from './embedding.controller';

@Module({
  imports: [],
  controllers: [AppController, IngestionController, StatusController, EmbeddingController],
  providers: [MockService],
})
export class AppModule {}
