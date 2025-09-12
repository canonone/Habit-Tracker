import { DataSource } from 'typeorm';
import { config } from 'dotenv';
config();

const isDatabaseUrl = !!process.env.DATABASE_URL;

const dataSource = new DataSource(
  isDatabaseUrl
    ? {
        type: 'postgres',
        url: process.env.DATABASE_URL,
        entities: [process.env.DB_ENTITIES!],
        synchronize: process.env.TYPEORM_SYNC === 'true',
        ssl: {
          rejectUnauthorized: false, // Required for Neon
        },
      }
    : {
        type: (process.env.DB_TYPE as 'postgres') || 'postgres',
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT!,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [process.env.DB_ENTITIES!],
        synchronize: process.env.TYPEORM_SYNC === 'true',
        ssl: process.env.DB_SSL === 'true', // optional for local
      },
);

export async function initializeDatasource() {
  if (!dataSource.isInitialized) {
    try {
      await dataSource.initialize();
      console.log('✅ Database initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize datasource:', error);
      process.exit(1);
    }
  }
  return dataSource;
}

export default dataSource;
