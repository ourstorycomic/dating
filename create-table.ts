import { Client } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const client = new Client({
  connectionString: process.env.DIRECT_URL,
});

async function run() {
  await client.connect();
  const res = await client.query(`
    CREATE TABLE IF NOT EXISTS "CrossRoleCommission" (
      "id" TEXT NOT NULL,
      "parentRoleId" UUID NOT NULL,
      "childRoleId" UUID NOT NULL,
      "percentage" DECIMAL(5,2) NOT NULL,
      "isActive" BOOLEAN NOT NULL DEFAULT true,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,

      CONSTRAINT "CrossRoleCommission_pkey" PRIMARY KEY ("id")
    );
    ALTER TABLE "CrossRoleCommission" ADD CONSTRAINT "CrossRoleCommission_parentRoleId_fkey" FOREIGN KEY ("parentRoleId") REFERENCES "custom_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    ALTER TABLE "CrossRoleCommission" ADD CONSTRAINT "CrossRoleCommission_childRoleId_fkey" FOREIGN KEY ("childRoleId") REFERENCES "custom_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    CREATE UNIQUE INDEX "CrossRoleCommission_parentRoleId_childRoleId_key" ON "CrossRoleCommission"("parentRoleId", "childRoleId");
    CREATE INDEX "CrossRoleCommission_parentRoleId_idx" ON "CrossRoleCommission"("parentRoleId");
    CREATE INDEX "CrossRoleCommission_childRoleId_idx" ON "CrossRoleCommission"("childRoleId");
  `);
  console.log("Table created!");
  await client.end();
}
run().catch(console.error);
