import { Client } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const client = new Client({
  connectionString: process.env.DIRECT_URL,
});

async function run() {
  await client.connect();
  const res = await client.query(`NOTIFY pgrst, 'reload schema'`);
  console.log("PostgREST schema cache reloaded!");
  await client.end();
}
run().catch(console.error);
