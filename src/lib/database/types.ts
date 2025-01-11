export interface DatabaseConfig {
  host: string;
  database: string;
  user: string;
  password: string;
  port: number;
  ssl: boolean;
}

export interface QueryResult<T = any> {
  rows: T[];
  rowCount: number;
  fields?: Array<{
    name: string;
    dataTypeID: number;
  }>;
}