import dotenv from 'dotenv';

dotenv.config();

const config = {
  APP: {
    PORT: process.env.APP_PORT || 5000,
    ENV: process.env.APP_ENV || 'development',
  },
  JWT: {
    sercetKey: process.env.SERCET_KEY,
    expiresIn: process.env.EXPIRES_IN,
  },
  DB: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    application_name: process.env.DB_APPLICATION_NAME
  },
  pgConfig: {
    connectionString: process.env.pg_Config
  }
}

export default config;