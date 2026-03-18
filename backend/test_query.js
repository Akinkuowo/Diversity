const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const tasks = await prisma.volunteerTask.findMany({
      include: {
        business: {
          select: { name: true }
        },
        volunteer: {
          select: {
            user: {
              select: { firstName: true, lastName: true }
            }
          }
        },
        _count: {
          select: { assignments: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    console.log("Success:", tasks);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}
main();
