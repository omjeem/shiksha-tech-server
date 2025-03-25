import { drizzle } from 'drizzle-orm/node-postgres';
import { envConfigs } from '../config/envConfig';

const DATABASE_URL = envConfigs.database_url;

const db = drizzle(DATABASE_URL);
