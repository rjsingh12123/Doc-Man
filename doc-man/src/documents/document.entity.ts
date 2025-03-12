import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('simple-json')
  metadata: {
    fileSize: number;
    fileName: string;
    fileType: string;
    fileEncoding: string;
  };

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
