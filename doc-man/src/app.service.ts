import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  static getMicroserviceHost(): string {
    return process.env.MICROSERVICE_HOST ?? 'localhost';
  }

  static getMicroservicePort(): number {
    return parseInt(process.env.MICROSERVICE_PORT ?? '3000');
  }

  static getPort(): number {
    return parseInt(process.env.PORT ?? '3000');
  }
}
