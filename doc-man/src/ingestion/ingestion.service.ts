import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ingestion } from './injestion.entity';
import { AppService } from 'src/app.service';

@Injectable()
export class IngestionService {
  private ingestionUrl: string;
  constructor(
    @InjectRepository(Ingestion)
    private ingestionRepository: Repository<Ingestion>,
  ) {
    this.ingestionUrl = AppService.getIngestionUrl();
  }

  // method to ingest data
  async ingestData(data: Partial<Ingestion>): Promise<any> {
    let ingestion = await this.ingestionRepository.create(data);
    ingestion = await this.ingestionRepository.save(ingestion);

    const body = await JSON.stringify({...data, id: ingestion.id});

    // call the injestion api running at http://localhost:3000/ingestion and supply the data
    const response = await fetch(`${this.ingestionUrl}/ingestion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: body,
    });
    
    const responseData = await response.json();

    if(responseData.status) {
      ingestion.status = responseData.status;
      await this.ingestionRepository.save(ingestion);
    }

    return responseData;
  }

  // method to get the ingestion status
  async getIngestionStatus(id: string) {
    // call the injestion api running at http://localhost:3000/ingestion and supply the data
    const response = await fetch(`${this.ingestionUrl}/status/${id}`, {
      method: 'GET',
    });

    const ingestion = await this.ingestionRepository.findOne({ where: { id: parseInt(id) } });
    
    const responseData = await response.json();

    if(!ingestion) {
      throw new Error('Ingestion not found');
    }

    if(responseData.status) {
      ingestion.status = responseData.status;
      await this.ingestionRepository.save(ingestion);
    }
    
    return responseData;
  }

  // method to cancel the ingestion
  async cancelIngestion(id: string) {
    await fetch(`${this.ingestionUrl}/cancel/${id}`, {
      method: 'GET',
    });

    const ingestion = await this.ingestionRepository.findOne({ where: { id: parseInt(id) } });

    if(!ingestion) {
      throw new Error('Ingestion not found');
    }
    
    ingestion.status = 'cancelled';
    return this.ingestionRepository.save(ingestion);
  }

  // method to pause the ingestion
  async pauseIngestion(id: string) {
    await fetch(`${this.ingestionUrl}/pause/${id}`, {
      method: 'GET',
    });

    const ingestion = await this.ingestionRepository.findOne({ where: { id: parseInt(id) } });

    if(!ingestion) {
      throw new Error('Ingestion not found');
    }

    ingestion.status = 'paused';
    return this.ingestionRepository.save(ingestion);
  }

  // method to resume the ingestion
  async resumeIngestion(id: string) {
    await fetch(`${this.ingestionUrl}/resume/${id}`, {
      method: 'GET',
    });

    const ingestion = await this.ingestionRepository.findOne({ where: { id: parseInt(id) } });

    if(!ingestion) {
      throw new Error('Ingestion not found');
    }

    ingestion.status = 'resumed';
    return this.ingestionRepository.save(ingestion);
  }

  // method to retry the ingestion
  async retryIngestion(id: string) {

    await fetch(`${this.ingestionUrl}/retry/${id}`, {
      method: 'GET',
    });

    const ingestion = await this.ingestionRepository.findOne({ where: { id: parseInt(id) } });

    if(!ingestion) {
      throw new Error('Ingestion not found');
    }

    ingestion.status = 'retried';
    return this.ingestionRepository.save(ingestion);
  }

  // method to get the document embedding
  async getDocumentEmbedding(id: string) {

    const response = await fetch(`${this.ingestionUrl}/embedding/${id}`, {
      method: 'GET',
    });

    const responseData = await response.json();

    return responseData;
  }
}
