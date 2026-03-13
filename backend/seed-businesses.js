const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    console.log('--- Seeding Businesses ---');

    const hashedPassword = await bcrypt.hash('password123', 10);

    const businesses = [
        {
            email: 'tech.inclusion@example.com',
            firstName: 'Sarah',
            lastName: 'Chen',
            companyName: 'TechInclusion Solutions',
            industry: 'Technology',
            size: '50-200',
            description: 'Leading the way in accessible software design and neurodiverse hiring practices.',
            website: 'https://techinclusion.io',
            city: 'San Francisco',
            country: 'USA',
            badgeLevel: 'CHAMPION',
            diversityCommitment: 'We pledge to maintain at least 40% representation of underrepresented groups in technical roles.'
        },
        {
            email: 'green.spaces@example.com',
            firstName: 'Marcus',
            lastName: 'Johnson',
            companyName: 'Green Spaces Arch',
            industry: 'Real Estate',
            size: '10-50',
            description: 'Sustainable urban planning with a focus on community-driven development in underserved areas.',
            website: 'https://greenspaces.arch',
            city: 'Chicago',
            country: 'USA',
            badgeLevel: 'INCLUSION_PARTNER',
            diversityCommitment: 'Commitment to supplier diversity by sourcing 30% of materials from minority-owned businesses.'
        },
        {
            email: 'global.health@example.com',
            firstName: 'Elena',
            lastName: 'Rodriguez',
            companyName: 'Global Health Equity',
            industry: 'Healthcare',
            size: '500+',
            description: 'Providing equitable healthcare access through innovative community outreach programs.',
            website: 'https://ghequity.org',
            city: 'New York',
            country: 'USA',
            badgeLevel: 'CHAMPION',
            diversityCommitment: 'Eliminating healthcare disparities through cultural competency training for all medical staff.'
        },
        {
            email: 'creative.pulse@example.com',
            firstName: 'David',
            lastName: 'Smith',
            companyName: 'Creative Pulse Media',
            industry: 'Marketing',
            size: '50-100',
            description: 'A creative agency dedicated to authentic representation in advertising and media.',
            website: 'https://creativepulse.media',
            city: 'London',
            country: 'UK',
            badgeLevel: 'SUPPORTER',
            diversityCommitment: 'Ensuring diverse voices are reflected in 100% of our creative campaigns.'
        },
        {
            email: 'future.finance@example.com',
            firstName: 'Amara',
            lastName: 'Okonkwo',
            companyName: 'Future Finance Group',
            industry: 'Finance',
            size: '201-500',
            description: 'Democratizing financial literacy and supporting minority-led startups.',
            website: 'https://futurefinance.com',
            city: 'Lagos',
            country: 'Nigeria',
            badgeLevel: 'INCLUSION_PARTNER',
            diversityCommitment: 'Allocating $5M in annual funding specifically for women-led ventures.'
        },
        {
            email: 'edu.reach@example.com',
            firstName: 'Kenji',
            lastName: 'Sato',
            companyName: 'EduReach Global',
            industry: 'Education',
            size: '100-200',
            description: 'Breaking barriers in education through digital equity and inclusive curriculum design.',
            website: 'https://edureach.global',
            city: 'Tokyo',
            country: 'Japan',
            badgeLevel: 'CHAMPION',
            diversityCommitment: 'Providing scholarship programs for students from historically marginalized backgrounds.'
        }
    ];

    for (const b of businesses) {
        try {
            // Check if user exists
            let user = await prisma.user.findUnique({
                where: { email: b.email }
            });

            if (!user) {
                user = await prisma.user.create({
                    data: {
                        email: b.email,
                        password: hashedPassword,
                        firstName: b.firstName,
                        lastName: b.lastName,
                        role: 'BUSINESS',
                        emailVerified: true
                    }
                });
            }

            // Create or update business profile
            await prisma.business.upsert({
                where: { userId: user.id },
                update: {
                    companyName: b.companyName,
                    industry: b.industry,
                    size: b.size,
                    description: b.description,
                    website: b.website,
                    city: b.city,
                    country: b.country,
                    badgeLevel: b.badgeLevel,
                    diversityCommitment: b.diversityCommitment,
                    verificationStatus: 'VERIFIED',
                    verifiedAt: new Date(),
                    companyEmail: b.email
                },
                create: {
                    userId: user.id,
                    companyName: b.companyName,
                    companyEmail: b.email,
                    industry: b.industry,
                    size: b.size,
                    description: b.description,
                    website: b.website,
                    city: b.city,
                    country: b.country,
                    badgeLevel: b.badgeLevel,
                    diversityCommitment: b.diversityCommitment,
                    verificationStatus: 'VERIFIED',
                    verifiedAt: new Date()
                }
            });

            console.log(`- Seeded: ${b.companyName}`);
        } catch (err) {
            console.error(`Error seeding ${b.companyName}:`, err);
        }
    }

    console.log('--- Business Seeding Complete ---');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
