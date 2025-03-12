import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { SwaggerModule } from '@nestjs/swagger';
import { DocumentBuilder } from '@nestjs/swagger';
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

  const config = new DocumentBuilder()
       .setTitle('DocMan')
       .setVersion('1.0')
       .addBearerAuth() // Add this line if you are using JWT authentication
       .build();
     const document = SwaggerModule.createDocument(app, config);
     SwaggerModule.setup('api', app, document);

  await app.startAllMicroservices();
  await app.listen(AppService.getPort());
}
bootstrap();