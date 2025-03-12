import { Injectable } from '@nestjs/common';

@Injectable()
export class MockService {
  private ingestionStatuses: Record<string, string> = {};

  startIngestion(id: string) {
    this.ingestionStatuses[id] = 'Processing';
    setTimeout(() => {
      this.ingestionStatuses[id] = Math.random() > 0.5 ? 'Completed' : 'Failed';
    }, Math.floor(Math.random() * (5 - 2 + 1) + 2) * 60 * 1000); // Simulate processing delay between 2 to 5 minutes
  }

  getStatus(id: string): string {
    return this.ingestionStatuses[id] || 'Not Found';
  }

  getEmbedding(id: string): number[] {
    return [0.1, 0.2, 0.3, 0.4, 0.5]; // Return sample embedding
  }

  cancelIngestion(id: string) {
    this.ingestionStatuses[id] = 'Cancelled';
  }

  pauseIngestion(id: string) {
    this.ingestionStatuses[id] = 'Paused';
  }

  resumeIngestion(id: string) {
    this.ingestionStatuses[id] = 'Processing';
  }

  retryIngestion(id: string) {
    this.ingestionStatuses[id] = 'Processing';
  }
}