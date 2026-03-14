const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding community projects...');

  const projects = [
    {
      title: 'City Tech Literacy Program',
      description: 'Providing free coding and digital literacy workshops for underprivileged youth in the metropolitan area. We aim to bridge the digital divide by offering hardware and mentorship.',
      goal: 15000,
      raised: 4500,
      category: 'Education',
      location: 'Downtown Metro',
      startDate: new Date(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
      status: 'APPROVED',
      organization: 'TechForAll NGO',
      contactEmail: 'contact@techforall.org',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Green Canopy Initiative',
      description: 'A community-led urban reforestation project aiming to plant 5,000 native trees in local parks and residential areas to improve air quality and provide shade.',
      goal: 8000,
      raised: 2100,
      category: 'Environment',
      location: 'Northside Parks',
      startDate: new Date(),
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      status: 'APPROVED',
      organization: 'EcoFoundry',
      contactEmail: 'info@ecofoundry.net',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Safe Harbor Youth Shelter',
      description: 'Upgrading the facilities of our local youth shelter to provide better emergency accommodation and mental health support for homeless LGBTQ+ youth.',
      goal: 25000,
      raised: 12000,
      category: 'Social Impact',
      location: 'West End',
      startDate: new Date(),
      endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
      status: 'APPROVED',
      organization: 'Safe Harbor Alliance',
      contactEmail: 'support@safeharbor.org',
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Diversity in Arts Festival',
      description: 'A weekend festival celebrating local artists from diverse backgrounds through exhibitions, live performances, and interactive workshops for all ages.',
      goal: 5000,
      raised: 4200,
      category: 'Arts & Culture',
      location: 'Central Plaza',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'APPROVED',
      organization: 'Creative Diversity Collective',
      contactEmail: 'festival@cdc.biz',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800'
    }
  ];

  for (const project of projects) {
    await prisma.communityProject.create({
      data: project
    });
  }

  console.log(`Successfully seeded ${projects.length} demo projects.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
