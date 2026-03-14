const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function repair() {
    console.log("--- Starting Connection Repair ---");
    
    // 1. Find all 'connection_accepted' notifications
    const notifications = await prisma.notification.findMany({
        where: { type: "connection_accepted" }
    });
    
    console.log(`Found ${notifications.length} acceptance notifications.`);
    
    for (const n of notifications) {
        console.log(`Processing notification for userId: ${n.userId}`);
        const message = n.message;
        
        // Example message: "Oluwaseun Akinkuowo has accepted your connection request."
        const acceptorMatch = message.match(/(.+) has accepted/);
        const acceptorName = acceptorMatch ? acceptorMatch[1] : null;
        
        if (!acceptorName) {
            console.log(`Could not determine acceptor name from message: "${message}"`);
            continue;
        }
        
        // The userId in the notification is the recipient (the one who gets notified, i.e., the original requester)
        const requesterId = n.userId;
        
        // Find the acceptor
        // We look for a user whose firstName + lastName matches or is contained within the acceptorName
        const users = await prisma.user.findMany({
            select: { id: true, firstName: true, lastName: true, email: true }
        });
        
        const acceptor = users.find(u => {
            const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
            const searchName = acceptorName.toLowerCase();
            return searchName.includes(fullName) || fullName.includes(searchName) || 
                   (u.firstName && searchName.includes(u.firstName.toLowerCase()) && u.lastName && searchName.includes(u.lastName.toLowerCase()));
        });
        
        if (acceptor) {
            console.log(`Linking Requester (${requesterId}) with Acceptor (${acceptor.id} - ${acceptor.email})`);
            
            // Create or update the connection
            await prisma.connection.upsert({
                where: {
                    requesterId_recipientId: {
                        requesterId: requesterId,
                        recipientId: acceptor.id
                    }
                },
                update: { status: "ACCEPTED" },
                create: {
                    requesterId: requesterId,
                    recipientId: acceptor.id,
                    status: "ACCEPTED"
                }
            });
            
            // Connections are symmetric in count usually, but let's check current profile counts
            // Actually, we should just set the count to the number of ACCEPTED connections
        } else {
            console.log(`Could not find user matching name: "${acceptorName}"`);
        }
    }
    
    // 2. Sync connection counts for ALL user profiles based on the Connection model
    console.log("\n--- Syncing Profile Connection Counts ---");
    const profiles = await prisma.userProfile.findMany();
    
    for (const profile of profiles) {
        const count = await prisma.connection.count({
            where: {
                status: "ACCEPTED",
                OR: [
                    { requesterId: profile.userId },
                    { recipientId: profile.userId }
                ]
            }
        });
        
        await prisma.userProfile.update({
            where: { id: profile.id },
            data: { connections: count }
        });
        
        console.log(`Updated profile ${profile.userId}: ${count} connections`);
    }
    
    console.log("\n--- Repair Complete ---");
}

repair()
    .catch(err => {
        console.error("Repair failed:", err);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
