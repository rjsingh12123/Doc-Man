import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { AppService } from './app.service';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: AppService.getMicroserviceHost(),
      port: AppService.getMicroservicePort(),
    },
  });

  await app.startAllMicroservices();
  await app.listen(AppService.getPort());
}
bootstrap();