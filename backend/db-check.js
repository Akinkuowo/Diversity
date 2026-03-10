const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const profiles = await prisma.userProfile.findMany({
        select: {
            userId: true,
            user: { select: { email: true, firstName: true } },
            avatar: true,
            bio: true
        }
    });
    console.log("DB Profiles:", JSON.stringify(profiles, null, 2));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
