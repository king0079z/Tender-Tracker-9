import { Client } from 'pg';

export class AzureDatabase {
  private client: Client | null = null;
  private static instance: AzureDatabase;
  private isConnected: boolean = false;

  private constructor() {
    // Don't create the client in the constructor
    // It will be created when connect() is called
  }

  static getInstance() {
    if (!AzureDatabase.instance) {
      AzureDatabase.instance = new AzureDatabase();
    }
    return AzureDatabase.instance;
  }

  private createClient() {
    if (!this.client) {
      this.client = new Client({
        host: import.meta.env.VITE_AZURE_DB_HOST,
        database: import.meta.env.VITE_AZURE_DB_NAME,
        user: import.meta.env.VITE_AZURE_DB_USER,
        password: import.meta.env.VITE_AZURE_DB_PASSWORD,
        port: 5432,
        ssl: {
          rejectUnauthorized: false // Required for Azure Database for PostgreSQL
        }
      });
    }
    return this.client;
  }

  async connect() {
    if (this.isConnected) {
      return true;
    }

    try {
      this.client = this.createClient();
      await this.client.connect();
      this.isConnected = true;
      console.log('Connected to Azure Database');
      return true;
    } catch (error) {
      this.isConnected = false;
      console.error('Failed to connect to Azure Database:', error);
      throw error;
    }
  }

  async query(text: string, params?: any[]) {
    if (!this.isConnected || !this.client) {
      throw new Error('Database not connected. Call connect() first.');
    }

    try {
      return await this.client.query(text, params);
    } catch (error) {
      console.error('Query error:', error);
      throw error;
    }
  }

  async end() {
    if (this.client) {
      try {
        await this.client.end();
        this.client = null;
        this.isConnected = false;
      } catch (error) {
        console.error('Error closing database connection:', error);
        throw error;
      }
    }
  }
}

export const db = AzureDatabase.getInstance();