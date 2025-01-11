export const isDevelopment = import.meta.env.DEV;

export const dbConfig = {
  connectionString: 'Server=tcp:tender-tracking-server.database.windows.net,1433;Initial Catalog=tender-tracking-db;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;Authentication="Active Directory Default";',
  ssl: {
    rejectUnauthorized: false
  }
};