import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsEmail, IsPhoneNumber, IsOptional, IsArray, IsEnum } from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
  VIEWER = 'viewer',
  EDITOR = 'editor',
}

export enum UserPermissions {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  ALL = 'all',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ type: 'simple-array' })
  @IsArray()
  @IsEnum(UserPermissions, { each: true })
  permissions: UserPermissions[];

  @Column()
  @IsEmail()
  @IsOptional()
  email: string;

  @Column()
  @IsPhoneNumber()
  @IsOptional()
  phone: string;
}

