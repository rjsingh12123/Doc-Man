import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Ingestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: string;
}
