const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const avatars = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop'
];

const skillsList = ['React', 'Node.js', 'Python', 'UI/UX Design', 'Product Management', 'Data Science', 'Marketing', 'Sales', 'DevOps', 'Graphic Design'];
const interestsList = ['Mentorship', 'Startups', 'Open Source', 'AI/ML', 'Diversity & Inclusion', 'Sustainability', 'FinTech', 'HealthTech'];

function getRandomItems(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

async function main() {
  console.log('--- Seeding Network Profiles ---');

  const users = await prisma.user.findMany({ select: { id: true, firstName: true } });

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    
    const existingProfile = await prisma.userProfile.findUnique({
      where: { userId: user.id }
    });

    if (existingProfile) {
        console.log(`Profile already exists for ${user.firstName} (${user.id}), skipping...`);
        continue;
    }

    const profileData = {
      userId: user.id,
      bio: `Hi, I'm ${user.firstName}. I'm passionate about technology, community building, and bridging the gap in the industry. Looking forward to connecting with like-minded individuals!`,
      avatar: avatars[i % avatars.length],
      city: ['San Francisco', 'New York', 'London', 'Berlin', 'Toronto', 'Remote'][i % 6],
      country: ['USA', 'USA', 'UK', 'Germany', 'Canada', 'Global'][i % 6],
      skills: getRandomItems(skillsList, Math.floor(Math.random() * 4) + 2),
      interests: getRandomItems(interestsList, Math.floor(Math.random() * 3) + 2),
      connections: Math.floor(Math.random() * 500),
      impactPoints: Math.floor(Math.random() * 1000)
    };

    try {
      await prisma.userProfile.create({
        data: profileData
      });
      console.log(`- Seeded Profile for: ${user.firstName}`);
    } catch (err) {
      console.error(`Error seeding profile for ${user.firstName}:`, err);
    }
  }

  console.log('--- Network Profile Seeding Complete ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
