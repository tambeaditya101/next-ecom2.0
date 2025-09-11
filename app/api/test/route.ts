import { prisma } from '@/lib/prisma';

export async function GET() {
  const users = await prisma.user.findMany(); // will fail until we add schema
  return Response.json(users);
}
