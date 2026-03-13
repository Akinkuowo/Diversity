const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- Seeding Announcements ---');

    const authorId = 'cmmj0lggk0000oh7c4fjhnfdu'; // Retrieved from database

    const announcements = [
        {
            title: 'New Community Guidelines Updated',
            content: 'We have updated our community guidelines to better reflect our commitment to inclusivity and respect. Please review them in the settings page.',
            type: 'INFO',
            priority: 'MEDIUM',
            authorId: authorId,
            publishedAt: new Date()
        },
        {
            title: 'Upcoming DE&I Workshop: Unconscious Bias',
            content: 'Join us this Friday for an interactive workshop on identifying and mitigating unconscious bias in the workplace. Register in the events section!',
            type: 'SUCCESS',
            priority: 'HIGH',
            authorId: authorId,
            publishedAt: new Date()
        },
        {
            title: 'Platform Maintenance Notice',
            content: 'The platform will be undergoing scheduled maintenance this Sunday from 2:00 AM to 4:00 AM UTC. Some features may be temporarily unavailable.',
            type: 'WARNING',
            priority: 'LOW',
            authorId: authorId,
            publishedAt: new Date()
        },
        {
            title: 'Diversity Network Reaches 10k Members!',
            content: 'We are thrilled to announce that our community has grown to over 10,000 active members. Thank you for being part of this incredible journey!',
            type: 'SUCCESS',
            priority: 'HIGH',
            authorId: authorId,
            publishedAt: new Date()
        },
        {
            title: 'New Resource: Inclusive Hiring Toolkit',
            content: 'Check out our latest resource, a comprehensive toolkit for building more inclusive hiring processes. Available now in the Resources section.',
            type: 'INFO',
            priority: 'MEDIUM',
            authorId: authorId,
            publishedAt: new Date()
        }
    ];

    for (const a of announcements) {
        try {
            await prisma.announcement.create({
                data: a
            });
            console.log(`- Seeded Announcement: ${a.title}`);
        } catch (err) {
            console.error(`Error seeding announcement ${a.title}:`, err);
        }
    }

    console.log('--- Announcement Seeding Complete ---');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
