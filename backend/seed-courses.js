const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
    console.log('Seeding courses...');

    const coursesToSeed = [
        {
            id: 'topic-1',
            title: 'Cultural Awareness',
            description: 'Deepen your understanding of different cultures in the workplace.',
            level: 'BEGINNER',
            duration: 60,
            category: 'Culture',
            tags: ['Culture', 'Diversity', 'Awareness'],
            isPublished: true,
            type: 'PUBLIC'
        },
        {
            id: 'topic-2',
            title: 'Workplace Inclusion',
            description: 'Strategies for creating a truly inclusive environment.',
            level: 'INTERMEDIATE',
            duration: 90,
            category: 'Inclusion',
            tags: ['Inclusion', 'Workplace', 'Strategy'],
            isPublished: true,
            type: 'PUBLIC'
        },
        {
            id: 'topic-3',
            title: 'Community Cohesion',
            description: 'Building stronger, more unified communities.',
            level: 'ADVANCED',
            duration: 120,
            category: 'Community',
            tags: ['Community', 'Cohesion', 'Unity'],
            isPublished: true,
            type: 'PUBLIC'
        },
        {
            id: 'topic-4',
            title: 'Anti-racism Awareness',
            description: 'Recognizing and dismantling systemic racism.',
            level: 'INTERMEDIATE',
            duration: 75,
            category: 'Diversity',
            tags: ['Anti-racism', 'Awareness', 'Social Justice'],
            isPublished: true,
            type: 'PUBLIC'
        },
        {
            id: 'topic-5',
            title: 'Bias Awareness',
            description: 'Identifying and mitigating unconscious biases.',
            level: 'BEGINNER',
            duration: 45,
            category: 'Psychology',
            tags: ['Bias', 'Unconscious Bias', 'Awareness'],
            isPublished: true,
            type: 'PUBLIC'
        },
        {
            id: 'topic-6',
            title: 'Inclusive Leadership',
            description: 'Leading with empathy and inclusivity.',
            level: 'ADVANCED',
            duration: 150,
            category: 'Leadership',
            tags: ['Leadership', 'Management', 'Inclusion'],
            isPublished: true,
            type: 'PUBLIC'
        }
    ];

    for (const course of coursesToSeed) {
        await prisma.course.upsert({
            where: { id: course.id },
            update: course,
            create: course
        });
        console.log(`Seeded course: ${course.title} (${course.id})`);
    }

    console.log('Seeding completed!');
}

seed()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
