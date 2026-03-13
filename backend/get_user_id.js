const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (user) {
        console.log(user.id);
    } else {
        const firstUser = await prisma.user.findFirst();
        console.log(firstUser ? firstUser.id : 'no_user_found');
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
