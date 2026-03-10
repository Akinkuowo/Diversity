const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const authorId = 'cmmj0lggk0000oh7c4fjhnfdu'; // Using existing user ID

    const posts = [
        {
            title: 'How to Build an Inclusive Engineering Culture?',
            content: 'I am looking for advice on how to make our engineering team more inclusive. We have a diverse team but I want to ensure everyone feels a sense of belonging. What strategies have worked for you?',
            category: 'inclusion',
            tags: ['engineering', 'culture', 'leadership'],
            isPinned: true
        },
        {
            title: 'Mentorship Opportunities for Underrepresented Groups in STEM',
            content: 'Does anyone know of good mentorship programmes specifically for minority groups entering STEM fields? I am looking to mentor or find a mentor for some of our junior staff.',
            category: 'career',
            tags: ['mentorship', 'stem', 'career'],
            isPinned: false
        },
        {
            title: 'Upcoming Diversity Networking Night - Next Friday!',
            content: 'Just a reminder that we are hosting a networking night next Friday! It is a great chance to meet other members and share experiences. Who is coming?',
            category: 'news',
            tags: ['networking', 'event', 'community'],
            isPinned: false
        },
        {
            title: 'Remote Work and Disability Inclusion',
            content: 'Remote work has been a game changer for many people with disabilities. How can we ensure that the shift back to hybrid or office-based work does not exclude these talented individuals?',
            category: 'inclusion',
            tags: ['remote-work', 'disability', 'equity'],
            isPinned: false
        }
    ];

    console.log('Seeding forum posts...');

    for (const postData of posts) {
        const post = await prisma.forumPost.create({
            data: {
                ...postData,
                authorId,
                comments: {
                    create: [
                        {
                            content: 'This is such a great question! One thing that worked for us was setting up specific affinity groups where people could share their experiences safely.',
                            authorId
                        },
                        {
                            content: 'I agree, safety and trust are the foundations of any inclusive culture.',
                            authorId
                        }
                    ]
                }
            }
        });
        console.log(`Created forum post: ${post.title}`);
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
