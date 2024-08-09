import { Client } from 'pg';
import { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DB } from '@config';

export const client = new Client({
  connectionString: `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`,
  connectionTimeoutMillis: 0,
  database: POSTGRES_DB,
  host: POSTGRES_HOST,
  idle_in_transaction_session_timeout: 0,
  password: POSTGRES_PASSWORD,
  port: Number(POSTGRES_PORT),
});

client.connect();

console.log(`
================================================================
Postgres connection established successfully                   |
================================================================
Host: ${POSTGRES_HOST}                                                |
Password: ${POSTGRES_PASSWORD}                                         |
User: ${POSTGRES_USER}                                                 |
Database: ${POSTGRES_DB}                                                  |
================================================================
`);

export default client;
