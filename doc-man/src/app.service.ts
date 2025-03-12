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

  static getDbType(): string {
    return process.env.DB_TYPE ?? 'postgres';
  }

  static getDbHost(): string {
    return process.env.DB_HOST ?? 'localhost';
  }

  static getDbPort(): number {
    return parseInt(process.env.DB_PORT ?? '5432');
  }

  static getDbUsername(): string {
    return process.env.DB_USERNAME ?? 'postgres';
  }

  static getDbPassword(): string {
    return process.env.DB_PASSWORD ?? 'postgres';
  }

  static getDb(): string {
    return process.env.DB_DATABASE ?? 'postgres';
  }

  static getSwaggerUrl(): string {
    return process.env.SWAGGER_URL ?? 'http://localhost:3000/api';
  }

  static getJwtSecret(): string {
    return process.env.JWT_SECRET ?? 'secret';
  }

  static getJwtExpiresIn(): string {
    return process.env.JWT_EXPIRES_IN ?? '1h';
  }

  static getJwtRefreshTokenSecret(): string {
    return process.env.JWT_REFRESH_TOKEN_SECRET ?? 'secret';
  }

  static getJwtRefreshTokenExpiresIn(): string {
    return process.env.JWT_REFRESH_TOKEN_EXPIRES_IN ?? '1d';
  }

  static getIngestionUrl(): string {
    return process.env.INGESTION_URL ?? 'http://localhost:3001';
  }
}
