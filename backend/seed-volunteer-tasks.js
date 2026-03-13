const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- Seeding Volunteer Tasks ---');

    const tasks = [
        {
            title: 'Youth Mentorship Program',
            description: 'Provide guidance and mentorship to young individuals from underrepresented backgrounds interested in STEAM careers.',
            project: 'Education & Mentorship',
            startDate: new Date('2024-04-01'),
            endDate: new Date('2024-12-31'),
            hours: 10,
            status: 'OPEN'
        },
        {
            title: 'DE&I Global Summit Support',
            description: 'Assist in the coordination and execution of our annual DE&I Global Summit. Roles include session moderation, attendee support, and logistics.',
            project: 'Events',
            startDate: new Date('2024-05-15'),
            endDate: new Date('2024-05-17'),
            hours: 16,
            status: 'OPEN'
        },
        {
            title: 'Accessibility Audit Volunteer',
            description: 'Help us audit community resources and partner websites for WCAG 2.1 compliance. Training provided.',
            project: 'Technology & Digital Equity',
            startDate: new Date('2024-04-10'),
            endDate: null,
            hours: 5,
            status: 'OPEN'
        },
        {
            title: 'Community Career Coach',
            description: 'Conduct mock interviews and review resumes for community members transitioning into new industries.',
            project: 'Career Development',
            startDate: new Date('2024-04-05'),
            endDate: null,
            hours: 4,
            status: 'OPEN'
        },
        {
            title: 'Language Translation (Spanish)',
            description: 'Translate our core DE&I toolkits into Spanish to broaden our impact in Hispanic communities.',
            project: 'Content & Localization',
            startDate: new Date('2024-04-01'),
            endDate: new Date('2024-06-30'),
            hours: 20,
            status: 'OPEN'
        },
        {
            title: 'Inclusivity Workshop Facilitator',
            description: 'Lead interactive workshops on unconscious bias and inclusive communication for local small businesses.',
            project: 'Advocacy & Outreach',
            startDate: new Date('2024-05-01'),
            endDate: new Date('2024-08-31'),
            hours: 8,
            status: 'OPEN'
        }
    ];

    for (const t of tasks) {
        try {
            await prisma.volunteerTask.create({
                data: t
            });
            console.log(`- Seeded Task: ${t.title}`);
        } catch (err) {
            console.error(`Error seeding task ${t.title}:`, err);
        }
    }

    console.log('--- Volunteer Task Seeding Complete ---');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
