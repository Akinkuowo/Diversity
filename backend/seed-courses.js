const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding demo courses...');

    const courses = [
        {
            title: 'Inclusive Leadership Foundations',
            description: 'Learn the core principles of inclusive leadership and how to build diverse teams that thrive.',
            level: 'BEGINNER',
            duration: 120,
            category: 'Leadership',
            tags: ['DEI', 'Management', 'Inclusion'],
            isPublished: true,
            type: 'PUBLIC'
        },
        {
            title: 'Unconscious Bias in Recruitment',
            description: 'Master strategies to identify and mitigate unconscious bias throughout the hiring process.',
            level: 'INTERMEDIATE',
            duration: 90,
            category: 'Human Resources',
            tags: ['Hiring', 'Bias', 'Diversity'],
            isPublished: true,
            type: 'PUBLIC'
        },
        {
            title: 'Neurodiversity in the Workplace',
            description: 'A comprehensive guide to understanding neurodivergence and creating an accommodating work environment.',
            level: 'BEGINNER',
            duration: 60,
            category: 'Culture',
            tags: ['Neurodiversity', 'Accessibility', 'Culture'],
            isPublished: true,
            type: 'PUBLIC'
        },
        {
            title: 'Advanced Cultural Competency',
            description: 'Deep dive into cross-cultural communication and global DEI strategies for multinational organizations.',
            level: 'ADVANCED',
            duration: 180,
            category: 'Communication',
            tags: ['Global', 'Culture', 'DEI'],
            isPublished: true,
            type: 'PUBLIC'
        },
        {
            title: 'Accessible Design Principles',
            description: 'Learn how to design products and spaces that are accessible to everyone, regardless of ability.',
            level: 'INTERMEDIATE',
            duration: 150,
            category: 'Design',
            tags: ['Accessibility', 'UX', 'Design'],
            isPublished: true,
            type: 'PUBLIC'
        }
    ];

    for (const course of courses) {
        const created = await prisma.course.upsert({
            where: { id: `demo-${course.title.toLowerCase().replace(/\s+/g, '-')}` },
            update: course,
            create: {
                id: `demo-${course.title.toLowerCase().replace(/\s+/g, '-')}`,
                ...course
            }
        });
        console.log(`- Created course: ${created.title}`);

        // Add some modules to each course
        const moduleTitles = ['Introduction', 'Core Concepts', 'Practical Application', 'Assessment'];
        for (let i = 0; i < moduleTitles.length; i++) {
            await prisma.courseModule.upsert({
                where: { id: `mod-${created.id}-${i}` },
                update: {
                    title: moduleTitles[i],
                    order: i,
                    courseId: created.id
                },
                create: {
                    id: `mod-${created.id}-${i}`,
                    title: moduleTitles[i],
                    order: i,
                    courseId: created.id
                }
            });
        }
    }

    console.log('Seeding completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
