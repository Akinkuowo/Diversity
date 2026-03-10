const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const organizerId = 'cmmj0lggk0000oh7c4fjhnfdu'; // Using existing user ID

    const events = [
        {
            title: 'Global Diversity & Inclusion Summit 2026',
            description: 'Join industry leaders and community advocates for a day of inspiring talks, workshops, and networking focused on driving diverse representation across all sectors.',
            type: 'Conference',
            category: 'Workplace Inclusion',
            startDate: new Date('2026-06-15T09:00:00Z'),
            endDate: new Date('2026-06-15T18:00:00Z'),
            location: 'London Convention Centre',
            online: false,
            capacity: 500,
            price: 49.99,
            status: 'PUBLISHED',
            image: 'https://images.unsplash.com/photo-1540575861501-7ad05823c23d?auto=format&fit=crop&q=80&w=1000',
            organizerId
        },
        {
            title: 'Accessible Design Workshop',
            description: 'A hands-on workshop focused on web accessibility standards and user-centric design for people with disabilities.',
            type: 'Workshop',
            category: 'Technology',
            startDate: new Date('2026-04-20T14:00:00Z'),
            endDate: new Date('2026-04-20T17:00:00Z'),
            location: 'Tech Hub London / Zoom',
            online: true,
            meetingUrl: 'https://zoom.us/j/example-meeting',
            capacity: 50,
            price: 0,
            status: 'PUBLISHED',
            image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000',
            organizerId
        },
        {
            title: 'Community Networking Mixer',
            description: 'Meet other members of the Diversity Network in a relaxed environment. Drinks and light snacks provided.',
            type: 'Social',
            category: 'Community',
            startDate: new Date('2026-03-25T18:30:00Z'),
            endDate: new Date('2026-03-25T21:00:00Z'),
            location: 'The Social Tap, Shoreditch',
            online: false,
            capacity: 100,
            price: 5.00,
            status: 'PUBLISHED',
            image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1000',
            organizerId
        },
        {
            title: 'Youth Mentorship Programme Launch',
            description: 'Celebrating the launch of our new mentorship scheme for underrepresented youth in STEM careers.',
            type: 'Seminar',
            category: 'Education',
            startDate: new Date('2026-05-10T11:00:00Z'),
            endDate: new Date('2026-05-10T13:00:00Z'),
            location: 'University Square Art Gallery',
            online: false,
            capacity: 150,
            price: 0,
            status: 'PUBLISHED',
            image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1000',
            organizerId
        }
    ];

    console.log('Seeding events...');

    for (const event of events) {
        const created = await prisma.event.create({
            data: {
                ...event,
                tickets: {
                    create: {
                        name: 'General Admission',
                        type: event.price > 0 ? 'PAID' : 'FREE',
                        price: event.price,
                        quantity: event.capacity,
                        available: event.capacity,
                        salesStart: new Date(),
                        salesEnd: event.startDate
                    }
                }
            }
        });
        console.log(`Created event: ${created.title}`);
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
