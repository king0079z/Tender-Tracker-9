/**
 * Client-side API wrapper for database operations
 */
export class DatabaseAPI {
  private baseUrl: string;
  private retryCount: number = 0;
  private maxRetries: number = 3;
  private retryDelay: number = 1000;

  constructor() {
    this.baseUrl = '/api';
  }

  private async retryOperation<T>(operation: () => Promise<T>): Promise<T> {
    try {
      const result = await operation();
      this.retryCount = 0; // Reset retry count on success
      return result;
    } catch (error) {
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        const delay = Math.min(this.retryDelay * Math.pow(2, this.retryCount - 1), 10000);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.retryOperation(operation);
      }
      throw error;
    }
  }

  async query(text: string, params?: any[]) {
    return this.retryOperation(async () => {
      const response = await fetch(`${this.baseUrl}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, params }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Query failed with status ${response.status}`);
      }

      return response.json();
    });
  }
}