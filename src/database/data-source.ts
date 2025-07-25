import { DataSource } from 'typeorm';
import { config } from 'dotenv';
config();

const dataSource = new DataSource({
  type: (process.env.DB_TYPE as 'postgres') || 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: +process.env.DB_PORT!,
  database: process.env.DB_NAME,
  entities: [process.env.DB_ENTITIES!],
  synchronize: process.env.TYPEORM_SYNC === 'true',
  ssl: process.env.DB_SSL === 'true',
});

export async function initializeDatasource() {
  if (!dataSource.isInitialized) {
    try {
      await dataSource.initialize();
    } catch (error) {
      console.error('failed to initialize Datasource', error);
      process.exit(1);
    }
  }
  return dataSource;
}

export default dataSource;
