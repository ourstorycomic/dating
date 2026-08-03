import { PrismaClient } from "@prisma/client"; 
const prisma = new PrismaClient(); 
async function main() { 
  console.log('Affiliates:', await prisma.affiliate.findMany()); 
  console.log('Users:', JSON.stringify(await prisma.user.findMany({include: {customRole: true}}), null, 2)); 
} 
main();
