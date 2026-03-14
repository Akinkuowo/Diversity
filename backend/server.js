const fastify = require('fastify')({ logger: true });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('@fastify/cors');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const prisma = new PrismaClient();

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER || 'mock-user',
    pass: process.env.SMTP_PASS || 'mock-pass'
  }
});

// Verification email sending function
const sendVerificationEmail = async (email, firstName, token) => {
  const verificationLink = `http://localhost:3000/verify?token=${token}`;

  try {
    const info = await transporter.sendMail({
      from: '"Diversity Network" <noreply@diversitynetwork.com>',
      to: email,
      subject: "Verify your Diversity Network account",
      text: `Hello ${firstName}, please verify your account by clicking this link: ${verificationLink}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #7c3aed;">Welcome to Diversity Network!</h2>
          <p>Hello ${firstName},</p>
          <p>Thank you for joining our community. Please click the button below to verify your email address and activate your account:</p>
          <div style="margin: 30px 0;">
            <a href="${verificationLink}" style="background-color: #7c3aed; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Verify Email Address</a>
          </div>
          <p style="font-size: 14px; color: #64748b;">If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="font-size: 14px; color: #7c3aed;">${verificationLink}</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #94a3b8;">This email was sent to ${email} as part of your registration on Diversity Network.</p>
        </div>
      `,
    });

    console.log(`[EMAIL SENT] Message ID: ${info.messageId}`);
  } catch (error) {
    console.error('[EMAIL ERROR]', error);
  }
};

const sendResetPasswordEmail = async (email, firstName, token) => {
  const resetLink = `http://localhost:3000/reset-password?token=${token}`;

  try {
    const info = await transporter.sendMail({
      from: '"Diversity Network" <noreply@diversitynetwork.com>',
      to: email,
      subject: "Reset your Diversity Network password",
      text: `Hello ${firstName}, you requested a password reset. Please click this link: ${resetLink}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #7c3aed;">Reset Your Password</h2>
          <p>Hello ${firstName},</p>
          <p>We received a request to reset your password for your Diversity Network account. Click the button below to set a new password:</p>
          <div style="margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #7c3aed; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
          </div>
          <p style="font-size: 14px; color: #64748b;">This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
          <p style="font-size: 14px; color: #7c3aed;">${resetLink}</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #94a3b8;">This email was sent to ${email} because a password reset was requested.</p>
        </div>
      `,
    });

    console.log(`[RESET EMAIL SENT] Message ID: ${info.messageId}`);
    console.log(`[RESET LINK] ${resetLink}`);
  } catch (error) {
    console.error('[RESET EMAIL ERROR]', error);
  }
};

fastify.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']
});

// Register Multipart for file uploads
fastify.register(require('@fastify/multipart'), {
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Register Static for serving uploads
fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'uploads'),
  prefix: '/uploads/', // URL prefix for files
});

// POST Upload Image
fastify.post('/upload', async (request, reply) => {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.code(401).send({ message: 'Unauthorized' });
  }

  try {
    const data = await request.file();
    if (!data) {
      return reply.code(400).send({ message: 'No file uploaded' });
    }

    const filename = `${Date.now()}-${data.filename}`;
    const uploadPath = path.join(__dirname, 'uploads', filename);
    const writeStream = fs.createWriteStream(uploadPath);

    await new Promise((resolve, reject) => {
      data.file.pipe(writeStream);
      data.file.on('end', resolve);
      data.file.on('error', reject);
    });

    return {
      url: `http://localhost:3001/uploads/${filename}`
    };
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'File upload failed' });
  }
});

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

const authenticate = (request, reply) => {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    reply.code(401).send({ message: 'Unauthorized' });
    return null;
  }
  const token = authHeader.split(' ')[1];
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    reply.code(401).send({ message: 'Invalid token' });
    return null;
  }
};

const includeBadgeData = {
  diversityPledge: true,
  employees: {
    include: {
      enrollments: true
    }
  },
  courses: {
    include: {
      enrollments: {
        include: {
          user: true
        }
      },
      modules: true
    }
  },
  volunteerTasks: {
    include: {
      volunteerHours: true
    }
  },
  sponsorships: true,
  employmentNotices: true
};

const calculateBusinessBadges = (business) => {
  if (!business) return null;

  // 1. Diversity Pledge Badge
  const hasPledge = (business.diversityCommitment && business.diversityCommitment.trim().length > 10) || !!business.diversityPledge;
  
  // 2. Training Program Badge
  const hasTraining = business.courses?.some(c => (c.enrollments?.length || 0) > 0);

  // 3. Community Partner Badge
  const hasCommunity = business.sponsorships?.some(s => ['APPROVED', 'COMPLETED'].includes(s.status));

  // 4. Impact Report Badge
  const totalDonated = (business.sponsorships || [])
    .filter(s => ['APPROVED', 'COMPLETED'].includes(s.status))
    .reduce((sum, s) => sum + s.amount, 0);
  
  const totalHours = (business.volunteerTasks || []).reduce((sum, t) => 
    sum + (t.volunteerHours || []).reduce((hSum, h) => hSum + h.hours, 0), 0);
  
  const supportedProjects = new Set((business.sponsorships || []).map(s => s.projectId)).size;
  const estimatedReach = supportedProjects * 500;
  const employeeCount = (business.employees || []).length;

  const hasImpactReport = 
    totalDonated >= 1000 || 
    estimatedReach >= 10000 || 
    totalHours >= 500 || 
    employeeCount > 10;

  // 5. Leadership Certificate
  const hasLeadership = hasPledge && hasTraining && hasCommunity && hasImpactReport;

  const milestones = [
    { title: 'Diversity Pledge', completed: !!hasPledge, description: 'Fill in the Diversity & Inclusion Commitment section in your profile.' },
    { title: 'Training Program', completed: !!hasTraining, description: 'Set up at least one training course and receive an enrollment.' },
    { title: 'Community Partner', completed: !!hasCommunity, description: 'Make a successful sponsorship donation to a community project.' },
    { title: 'Impact Report', completed: !!hasImpactReport, description: 'Reach $1000+ donations, 10k reach, 500 hours service, or 10+ employees.' },
    { title: 'Leadership Certificate', completed: !!hasLeadership, description: 'Achieve all other diversity milestones.' }
  ];

  const earnedCount = milestones.filter(m => m.completed).length;
  const diversityScore = earnedCount * 20;

  // Training Hours Calculation
  const totalTrainingHours = (business.courses || []).reduce((sum, course) => {
    const completions = (course.enrollments || []).filter(e => e.progress === 100 || e.completedAt).length;
    return sum + (completions * (course.cpdHours || course.duration || 0));
  }, 0);

  // Impact Metrics (last 6 months)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  const last6Months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    last6Months.push({
      month: months[d.getMonth()],
      year: d.getFullYear(),
      volunteer: 0,
      training: 0,
      sponsorship: 0
    });
  }

  // Aggregate stats into months
  (business.volunteerTasks || []).forEach(task => {
    (task.volunteerHours || []).forEach(vh => {
      const vhDate = new Date(vh.date || task.createdAt);
      const mIdx = last6Months.findIndex(m => m.month === months[vhDate.getMonth()] && m.year === vhDate.getFullYear());
      if (mIdx !== -1) last6Months[mIdx].volunteer += vh.hours;
    });
  });

  (business.sponsorships || []).filter(s => ['APPROVED', 'COMPLETED'].includes(s.status)).forEach(s => {
    const sDate = new Date(s.createdAt);
    const mIdx = last6Months.findIndex(m => m.month === months[sDate.getMonth()] && m.year === sDate.getFullYear());
    if (mIdx !== -1) last6Months[mIdx].sponsorship += s.amount;
  });

  // Training Progress by Department
  const depts = {};
  (business.employees || []).forEach(emp => {
    const dept = emp.department || 'Other';
    if (!depts[dept]) depts[dept] = { department: dept, completed: 0, enrolled: 0 };
    
    (emp.enrollments || []).forEach(enr => {
      depts[dept].enrolled++;
      if (enr.progress === 100 || enr.completedAt) depts[dept].completed++;
    });
  });
  const trainingProgress = Object.values(depts);

  // Recent Activity Feed
  const activityList = [];
  
  (business.courses || []).forEach(course => {
    (course.enrollments || []).forEach(enr => {
      activityList.push({
        id: `course-${enr.id}`,
        type: 'course',
        title: enr.completedAt ? `Employee completed ${course.title}` : `Employee enrolled in ${course.title}`,
        user: `${enr.user?.firstName || 'User'} ${enr.user?.lastName || ''}`,
        time: enr.completedAt || enr.enrolledAt,
        rawDate: new Date(enr.completedAt || enr.enrolledAt)
      });
    });
  });

  (business.sponsorships || []).forEach(s => {
    activityList.push({
      id: `sponsorship-${s.id}`,
      type: 'badge',
      title: `Sponsored ${s.projectId || 'Project at ' + s.amount}`,
      user: business.companyName,
      time: s.createdAt,
      rawDate: new Date(s.createdAt)
    });
  });

  // Include Notifications in Recent Activities
  if (business.user?.notifications) {
    business.user.notifications.forEach(n => {
      activityList.push({
        id: `notification-${n.id}`,
        type: n.type === 'info' ? 'event' : 'event', // Mapping type to compatible icon type in frontend
        title: n.title,
        message: n.message,
        user: 'System Notification',
        time: n.createdAt,
        rawDate: new Date(n.createdAt)
      });
    });
  }

  const recentActivities = activityList
    .filter(a => a.rawDate && !isNaN(a.rawDate.getTime()))
    .sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime())
    .slice(0, 5)
    .map(a => ({
       ...a,
       time: formatRelativeTime(a.rawDate)
    }));

  return {
    milestones,
    stats: {
      totalEmployees: employeeCount,
      trainingHours: totalTrainingHours,
      volunteerHours: totalHours,
      diversityScore: `${diversityScore}%`,
      totalDonated,
      estimatedReach
    },
    summary: {
      earnedCount,
      isChampion: earnedCount >= 5,
      isPartner: earnedCount >= 3,
      isSupporter: earnedCount >= 1
    },
    impactMetrics: last6Months,
    trainingProgress,
    recentActivities
  };
};

function formatRelativeTime(date) {
  const diff = new Date() - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

// POST Change Password
fastify.post('/users/me/change-password', async (request, reply) => {
  const decoded = authenticate(request, reply);
  if (!decoded) return;
  const { currentPassword, newPassword } = request.body;
  if (!currentPassword || !newPassword) {
    return reply.code(400).send({ message: 'Both currentPassword and newPassword are required.' });
  }
  if (newPassword.length < 8) {
    return reply.code(400).send({ message: 'New password must be at least 8 characters.' });
  }
  const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
  if (!user) return reply.code(404).send({ message: 'User not found.' });
  const match = await bcrypt.compare(currentPassword, user.password);
  if (!match) return reply.code(400).send({ message: 'Current password is incorrect.' });
  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: decoded.userId }, data: { password: hashed } });
  // Invalidate all existing sessions for security
  await prisma.userSession.deleteMany({ where: { userId: decoded.userId } });
  return { message: 'Password updated successfully. Please log in again.' };
});

// GET Active Sessions
fastify.get('/users/me/sessions', async (request, reply) => {
  const decoded = authenticate(request, reply);
  if (!decoded) return;
  const sessions = await prisma.userSession.findMany({
    where: { userId: decoded.userId },
    orderBy: { lastActiveAt: 'desc' },
  });
  return sessions;
});

// DELETE Revoke a Session
fastify.delete('/users/me/sessions/:id', async (request, reply) => {
  const decoded = authenticate(request, reply);
  if (!decoded) return;
  const { id } = request.params;
  const session = await prisma.userSession.findUnique({ where: { id } });
  if (!session || session.userId !== decoded.userId) {
    return reply.code(404).send({ message: 'Session not found.' });
  }
  await prisma.userSession.delete({ where: { id } });
  return { message: 'Session revoked.' };
});

// DELETE Revoke all other sessions
fastify.delete('/users/me/sessions', async (request, reply) => {
  const decoded = authenticate(request, reply);
  if (!decoded) return;
  const currentToken = request.headers.authorization.split(' ')[1];
  await prisma.userSession.deleteMany({
    where: { userId: decoded.userId, NOT: { token: currentToken } }
  });
  return { message: 'All other sessions revoked.' };
});

// POST Setup 2FA — generates a TOTP secret & QR code
fastify.post('/users/me/2fa/setup', async (request, reply) => {
  const decoded = authenticate(request, reply);
  if (!decoded) return;
  const user = await prisma.user.findUnique({ where: { id: decoded.userId }, select: { email: true, twoFactorEnabled: true } });
  if (!user) return reply.code(404).send({ message: 'User not found.' });
  if (user.twoFactorEnabled) return reply.code(400).send({ message: '2FA is already enabled.' });
  const secret = speakeasy.generateSecret({ name: `Diversity Network (${user.email})`, length: 20 });
  // Temporarily save secret (not yet enabled until verified)
  await prisma.user.update({ where: { id: decoded.userId }, data: { twoFactorSecret: secret.base32 } });
  const qrDataUrl = await QRCode.toDataURL(secret.otpauth_url);
  return { secret: secret.base32, qrCode: qrDataUrl };
});

// POST Verify & Enable 2FA
fastify.post('/users/me/2fa/verify', async (request, reply) => {
  const decoded = authenticate(request, reply);
  if (!decoded) return;
  const { token } = request.body;
  const user = await prisma.user.findUnique({ where: { id: decoded.userId }, select: { twoFactorSecret: true } });
  if (!user || !user.twoFactorSecret) return reply.code(400).send({ message: '2FA setup not initiated.' });
  const valid = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: 'base32',
    token,
    window: 1,
  });
  if (!valid) return reply.code(400).send({ message: 'Invalid verification code. Please try again.' });
  await prisma.user.update({ where: { id: decoded.userId }, data: { twoFactorEnabled: true } });
  return { message: '2FA has been enabled successfully.' };
});

// POST Disable 2FA
fastify.post('/users/me/2fa/disable', async (request, reply) => {
  const decoded = authenticate(request, reply);
  if (!decoded) return;
  const { token } = request.body;
  const user = await prisma.user.findUnique({ where: { id: decoded.userId }, select: { twoFactorSecret: true, twoFactorEnabled: true } });
  if (!user || !user.twoFactorEnabled) return reply.code(400).send({ message: '2FA is not enabled.' });
  const valid = speakeasy.totp.verify({ secret: user.twoFactorSecret, encoding: 'base32', token, window: 1 });
  if (!valid) return reply.code(400).send({ message: 'Invalid code. Please try again.' });
  await prisma.user.update({ where: { id: decoded.userId }, data: { twoFactorEnabled: false, twoFactorSecret: null } });
  return { message: '2FA has been disabled.' };
});

// Register Route

fastify.post('/register', async (request, reply) => {
  const { email, password, firstName, lastName, role } = request.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return reply.code(400).send({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: role || 'COMMUNITY_MEMBER',
        verificationToken,
        profile: {
          create: {}
        }
      }
    });

    await sendVerificationEmail(email, firstName, verificationToken);

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });

    return { token, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } };
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Internal server error' });
  }
});

// Verify Email Route
fastify.get('/verify', async (request, reply) => {
  const { token } = request.query;

  if (!token) {
    return reply.code(400).send({ message: 'Verification token is required' });
  }

  try {
    const user = await prisma.user.findFirst({
      where: { verificationToken: token }
    });

    if (!user) {
      return reply.code(400).send({ message: 'Invalid or expired verification token' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null
      }
    });

    return { message: 'Email verified successfully! You can now log in.' };
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Internal server error during verification' });
  }
});

// Resend Verification Route
fastify.post('/resend-verification', async (request, reply) => {
  const { email } = request.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return reply.code(404).send({ message: 'User not found' });
    }

    if (user.emailVerified) {
      return reply.code(400).send({ message: 'Email already verified' });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    await prisma.user.update({
      where: { id: user.id },
      data: { verificationToken }
    });

    await sendVerificationEmail(email, user.firstName, verificationToken);

    return { message: 'Verification email resent' };
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Internal server error' });
  }
});

// Login Route
fastify.post('/login', async (request, reply) => {
  const { email, password, rememberMe } = request.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return reply.code(401).send({ message: 'Invalid email or password. Please check your credentials and try again.' });
    }

    if (!user.emailVerified) {
      return reply.code(403).send({ message: 'Please verify your email address before logging in.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return reply.code(401).send({ message: 'Invalid email or password. Please check your credentials and try again.' });
    }

    // Set expiration based on rememberMe
    const expiresIn = rememberMe ? '30d' : '1d';
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn });

    // Record a session entry so it shows up in Active Sessions
    await prisma.userSession.create({
      data: {
        userId: user.id,
        token,
        userAgent: request.headers['user-agent'] || null,
        ipAddress: request.ip || request.headers['x-forwarded-for'] || null,
      }
    });

    return { token, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } };
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Internal server error' });
  }
});


// Me Route - Get current user profile
fastify.get('/me', async (request, reply) => {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.code(401).send({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        profile: {
          select: {
            avatar: true,
            bio: true,
            connections: true
          }
        }
      }
    });

    if (!user) {
      return reply.code(404).send({ message: 'User not found' });
    }

    return user;
  } catch (error) {
    return reply.code(401).send({ message: 'Invalid token' });
  }
});

// GET Notifications Route
fastify.get('/notifications', async (request, reply) => {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.code(401).send({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const notifications = await prisma.notification.findMany({
      where: { userId: decoded.userId },
      orderBy: { createdAt: 'desc' }
    });
    return notifications;
  } catch (error) {
    return reply.code(401).send({ message: 'Invalid token' });
  }
});

// PATCH Mark Notification as Read
fastify.patch('/notifications/:id/read', async (request, reply) => {
  const { id } = request.params;
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.code(401).send({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const notification = await prisma.notification.findUnique({
      where: { id }
    });

    if (!notification || notification.userId !== decoded.userId) {
      return reply.code(404).send({ message: 'Notification not found' });
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { read: true }
    });

    return updated;
  } catch (error) {
    return reply.code(401).send({ message: 'Invalid token' });
  }
});

// POST Test Notification (For demo purposes)
fastify.post('/notifications/test', async (request, reply) => {
  const { userId, title, message, type, link } = request.body;
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type: type || 'info',
        link
      }
    });
    return notification;
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Internal server error' });
  }
});

// POST Send a Connection Request
fastify.post('/community/network/connect', async (request, reply) => {
  const decoded = authenticate(request, reply);
  if (!decoded) return;
  
  const { recipientId } = request.body;
  if (!recipientId) return reply.code(400).send({ message: 'recipientId is required' });
  if (recipientId === decoded.userId) return reply.code(400).send({ message: 'Cannot connect with yourself' });

  try {
    const sender = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { firstName: true, lastName: true }
    });

    // Create a connection record with PENDING status
    const connection = await prisma.connection.upsert({
      where: {
        requesterId_recipientId: {
          requesterId: decoded.userId,
          recipientId
        }
      },
      update: { status: 'PENDING' },
      create: {
        requesterId: decoded.userId,
        recipientId,
        status: 'PENDING'
      }
    });

    // Create a notification for the recipient
    const notification = await prisma.notification.create({
      data: {
        userId: recipientId,
        title: `${sender.firstName} ${sender.lastName} wants to connect`,
        message: `${sender.firstName} ${sender.lastName} sent you a connection request.`,
        type: 'connection_request',
        link: `/community/network?requesterId=${decoded.userId}`,
        read: false
      }
    });

    return { message: 'Connection request sent', notification, connection };
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Internal server error' });
  }
});

// POST Accept or Decline a Connection Request
fastify.post('/notifications/connection/respond', async (request, reply) => {
  const decoded = authenticate(request, reply);
  if (!decoded) return;
  
  const { notificationId, action, requesterId } = request.body;
  if (!notificationId || !action || !requesterId) {
    return reply.code(400).send({ message: 'notificationId, action, and requesterId are required' });
  }
  
  try {
    // Mark the request notification as read
    await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true }
    });

    if (action === 'accept') {
      const acceptor = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { firstName: true, lastName: true }
      });

      // Update the connection status to ACCEPTED (upsert in case it was a legacy request without a record)
      await prisma.connection.upsert({
        where: {
          requesterId_recipientId: {
            requesterId,
            recipientId: decoded.userId
          }
        },
        update: { status: 'ACCEPTED' },
        create: {
          requesterId,
          recipientId: decoded.userId,
          status: 'ACCEPTED'
        }
      });

      // Increment connection count for both users in their UserProfile
      await prisma.userProfile.update({
        where: { userId: decoded.userId },
        data: { connections: { increment: 1 } }
      });

      await prisma.userProfile.update({
        where: { userId: requesterId },
        data: { connections: { increment: 1 } }
      });

      // Notify the original requester that their request was accepted
      await prisma.notification.create({
        data: {
          userId: requesterId,
          title: `${acceptor.firstName} ${acceptor.lastName} accepted your request`,
          message: `${acceptor.firstName} ${acceptor.lastName} has accepted your connection request. You are now connected!`,
          type: 'connection_accepted',
          link: `/community/network`,
          read: false
        }
      });

      return { message: 'Connection accepted' };
    }

    if (action === 'decline') {
      // Update the connection status to DECLINED or delete it
      await prisma.connection.upsert({
        where: {
          requesterId_recipientId: {
            requesterId,
            recipientId: decoded.userId
          }
        },
        update: { status: 'DECLINED' },
        create: {
          requesterId,
          recipientId: decoded.userId,
          status: 'DECLINED'
        }
      });
      return { message: 'Connection declined' };
    }
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Internal server error' });
  }
});

fastify.get('/posts', async (request, reply) => {
  // Extract user ID from token if present (for liked status)
  let currentUserId = null;
  const authHeader = request.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      currentUserId = decoded.userId;
    } catch (e) { /* ignore invalid token for public feed */ }
  }

  try {
    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            role: true,
            profile: {
              select: {
                avatar: true
              }
            }
          }
        },
        _count: {
          select: {
            postLikes: true,
            postComments: true
          }
        },
        ...(currentUserId ? {
          postLikes: {
            where: { userId: currentUserId },
            select: { id: true },
            take: 1
          }
        } : {})
      },
      orderBy: { createdAt: 'desc' }
    });

    // Transform to add likedByMe and flatten counts
    const transformed = posts.map(post => ({
      ...post,
      likes: post._count.postLikes,
      commentCount: post._count.postComments,
      likedByMe: post.postLikes ? post.postLikes.length > 0 : false,
      _count: undefined,
      postLikes: undefined
    }));

    return transformed;
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Internal server error' });
  }
});

// GET User Profile
fastify.get('/users/me/profile', async (request, reply) => {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.code(401).send({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return reply.code(401).send({ message: 'Invalid token' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        profile: true
      }
    });

    if (!user) {
      return reply.code(404).send({ message: 'User not found' });
    }

    return user;
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Failed to fetch profile' });
  }
});

// PUT Update User Profile
fastify.put('/users/me/profile', async (request, reply) => {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.code(401).send({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return reply.code(401).send({ message: 'Invalid token' });
  }

  const { bio, avatar, phone, address, city, country, skills, interests, languages } = request.body;
  console.log('PUT /users/me/profile payload:', request.body);

  try {
    const updatedProfile = await prisma.userProfile.upsert({
      where: { userId: decoded.userId },
      update: {
        bio,
        avatar,
        phone,
        address,
        city,
        country,
        skills: skills || undefined,
        interests: interests || undefined,
        languages: languages || undefined
      },
      create: {
        userId: decoded.userId,
        bio,
        avatar,
        phone,
        address,
        city,
        country,
        skills: skills || [],
        interests: interests || [],
        languages: languages || []
      }
    });

    return updatedProfile;
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Failed to update profile' });
  }
});

// GET Notification Preferences
fastify.get('/users/me/notification-prefs', async (request, reply) => {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.code(401).send({ message: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return reply.code(401).send({ message: 'Invalid token' });
  }

  // upsert so every user always has a preferences row
  const prefs = await prisma.notificationPreferences.upsert({
    where: { userId: decoded.userId },
    create: { userId: decoded.userId },
    update: {},
  });
  return prefs;
});

// PUT Notification Preferences
fastify.put('/users/me/notification-prefs', async (request, reply) => {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.code(401).send({ message: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return reply.code(401).send({ message: 'Invalid token' });
  }

  const { communityUpdates, weeklyDigest, mentionsReplies, directMessages, eventReminders } = request.body;

  // Fetch previous state so we can detect which prefs just turned ON
  const previous = await prisma.notificationPreferences.findUnique({ where: { userId: decoded.userId } });

  const updated = await prisma.notificationPreferences.upsert({
    where: { userId: decoded.userId },
    create: {
      userId: decoded.userId,
      communityUpdates: communityUpdates ?? true,
      weeklyDigest: weeklyDigest ?? true,
      mentionsReplies: mentionsReplies ?? true,
      directMessages: directMessages ?? true,
      eventReminders: eventReminders ?? true,
    },
    update: {
      ...(communityUpdates !== undefined && { communityUpdates }),
      ...(weeklyDigest !== undefined && { weeklyDigest }),
      ...(mentionsReplies !== undefined && { mentionsReplies }),
      ...(directMessages !== undefined && { directMessages }),
      ...(eventReminders !== undefined && { eventReminders }),
    },
  });

  // Fetch the user's email so we can send a notification email
  const user = await prisma.user.findUnique({ where: { id: decoded.userId }, select: { email: true, firstName: true } });
  if (user) {
    const labelMap = {
      communityUpdates: 'Community Updates',
      weeklyDigest: 'Weekly Digest',
      mentionsReplies: 'Mentions & Replies',
      directMessages: 'Direct Messages',
      eventReminders: 'Event Reminders',
    };

    const newlyEnabled = Object.keys(labelMap).filter(key => {
      const wasOff = !previous || !previous[key];
      const isNowOn = request.body[key] === true;
      return wasOff && isNowOn;
    });

    if (newlyEnabled.length > 0) {
      const labelList = newlyEnabled.map(k => `<li>${labelMap[k]}</li>`).join('');
      await transporter.sendMail({
        from: '"Diversity Network" <noreply@diversitynetwork.com>',
        to: user.email,
        subject: 'Notification preferences updated',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #008080;">Notification Preferences Updated</h2>
            <p>Hi ${user.firstName},</p>
            <p>You have just <strong>enabled</strong> email notifications for the following:</p>
            <ul>${labelList}</ul>
            <p>You will now receive email updates for these notifications. You can change your preferences anytime in <strong>Settings → Notifications</strong>.</p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="font-size: 12px; color: #94a3b8;">Diversity Network · Unsubscribe anytime via your <a href="http://localhost:3000/settings">Settings</a>.</p>
          </div>
        `,
      }).catch(err => fastify.log.error('[NOTIFICATION EMAIL ERROR]', err));
    }
  }

  return updated;
});


fastify.get('/users/me/community-stats', async (request, reply) => {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.code(401).send({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return reply.code(401).send({ message: 'Invalid token' });
  }

  try {
    const userId = decoded.userId;

    const [
      eventsCount,
      forumPostsCount,
      postsCount,
      postCommentsCount,
      forumCommentsCount,
      userProfile
    ] = await Promise.all([
      prisma.eventRegistration.count({ where: { userId } }),
      prisma.forumPost.count({ where: { authorId: userId } }),
      prisma.post.count({ where: { userId } }),
      prisma.postComment.count({ where: { userId } }),
      prisma.forumComment.count({ where: { authorId: userId } }),
      prisma.userProfile.findUnique({
        where: { userId },
        select: { connections: true, impactPoints: true }
      })
    ]);

    const connections = userProfile?.connections || 0;
    const impactPoints = userProfile?.impactPoints || 0;
    const contributions = postsCount + postCommentsCount + forumPostsCount + forumCommentsCount;

    // Dynamic Ranking Logic Based on Impact Points
    let ranking = "Top 50%";
    if (impactPoints > 1000) ranking = "Top 5%";
    else if (impactPoints > 500) ranking = "Top 10%";
    else if (impactPoints > 100) ranking = "Top 25%";

    return {
      eventsAttended: eventsCount,
      forumPosts: forumPostsCount,
      connections: connections,
      impactPoints: impactPoints,
      contributions: contributions,
      communityRanking: ranking
    };
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Failed to fetch community stats' });
  }
});

// POST Create Post
fastify.post('/posts', async (request, reply) => {
  const { content, images, location } = request.body;
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.code(401).send({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return reply.code(401).send({ message: 'Invalid token' });
  }

  try {
    const post = await prisma.post.create({
      data: {
        userId: decoded.userId,
        content,
        images: images || [],
        location
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            role: true,
            profile: {
              select: {
                avatar: true
              }
            }
          }
        }
      }
    });

    // Award impact points for creating a community post
    await prisma.userProfile.update({
      where: { userId: decoded.userId },
      data: { impactPoints: { increment: 5 } }
    });

    return post;
  } catch (error) {
    fastify.log.error('Prisma Error creating post:', error);
    return reply.code(500).send({ message: 'Failed to create post in database', error: error.message });
  }
});

// PUT Update Post (owner only)
fastify.put('/posts/:id', async (request, reply) => {
  const { id } = request.params;
  const { content, location } = request.body;
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.code(401).send({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return reply.code(401).send({ message: 'Invalid token' });
  }

  try {
    // Verify ownership
    const existingPost = await prisma.post.findUnique({ where: { id } });
    if (!existingPost) {
      return reply.code(404).send({ message: 'Post not found' });
    }
    if (existingPost.userId !== decoded.userId) {
      return reply.code(403).send({ message: 'You can only edit your own posts' });
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        content: content !== undefined ? content : existingPost.content,
        location: location !== undefined ? location : existingPost.location
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            role: true,
            profile: { select: { avatar: true } }
          }
        }
      }
    });
    return updatedPost;
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Failed to update post' });
  }
});

// DELETE Post (owner only)
fastify.delete('/posts/:id', async (request, reply) => {
  const { id } = request.params;
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.code(401).send({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return reply.code(401).send({ message: 'Invalid token' });
  }

  try {
    const existingPost = await prisma.post.findUnique({ where: { id } });
    if (!existingPost) {
      return reply.code(404).send({ message: 'Post not found' });
    }
    if (existingPost.userId !== decoded.userId) {
      return reply.code(403).send({ message: 'You can only delete your own posts' });
    }

    await prisma.post.delete({ where: { id } });
    return { message: 'Post deleted successfully' };
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Failed to delete post' });
  }
});

// POST Toggle Like on a Post
fastify.post('/posts/:id/like', async (request, reply) => {
  const { id } = request.params;
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.code(401).send({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return reply.code(401).send({ message: 'Invalid token' });
  }

  try {
    // Check if the user already liked this post
    const existingLike = await prisma.postLike.findUnique({
      where: {
        userId_postId: {
          userId: decoded.userId,
          postId: id
        }
      }
    });

    if (existingLike) {
      // Unlike
      await prisma.postLike.delete({ where: { id: existingLike.id } });
    } else {
      // Like
      await prisma.postLike.create({
        data: {
          userId: decoded.userId,
          postId: id
        }
      });

      // Award impact points for liking a community post
      await prisma.userProfile.update({
        where: { userId: decoded.userId },
        data: { impactPoints: { increment: 1 } }
      });
    }

    // Get updated count
    const likeCount = await prisma.postLike.count({ where: { postId: id } });

    return {
      liked: !existingLike,
      likes: likeCount
    };
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Failed to toggle like' });
  }
});

// GET Comments for a Post
fastify.get('/posts/:id/comments', async (request, reply) => {
  const { id } = request.params;

  try {
    const comments = await prisma.postComment.findMany({
      where: { postId: id },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            profile: {
              select: {
                avatar: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });
    return comments;
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Failed to fetch comments' });
  }
});

// POST Create Comment on a Post
fastify.post('/posts/:id/comments', async (request, reply) => {
  const { id } = request.params;
  const { content } = request.body;
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.code(401).send({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return reply.code(401).send({ message: 'Invalid token' });
  }

  if (!content || content.trim().length === 0) {
    return reply.code(400).send({ message: 'Comment content is required' });
  }

  try {
    const comment = await prisma.postComment.create({
      data: {
        userId: decoded.userId,
        postId: id,
        content: content.trim()
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            profile: {
              select: {
                avatar: true
              }
            }
          }
        }
      }
    });

    // Award impact points for commenting on a community post
    await prisma.userProfile.update({
      where: { userId: decoded.userId },
      data: { impactPoints: { increment: 2 } }
    });

    return comment;
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Failed to create comment' });
  }
});

// Forgot Password Route
fastify.post('/forgot-password', async (request, reply) => {
  const { email } = request.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Return success even if user not found for security
      return { message: 'If an account exists with this email, a reset link has been sent.' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires
      }
    });

    await sendResetPasswordEmail(email, user.firstName, resetToken);

    return { message: 'Password reset link sent successfully.' };
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Internal server error' });
  }
});

// --- EVENTS ROUTES ---

// Get all published events
fastify.get('/events', async (request, reply) => {
  try {
    const { category, type } = request.query;
    const where = {
      status: 'PUBLISHED'
    };

    if (category && category !== 'All') {
      where.category = category;
    }

    if (type && type !== 'All') {
      where.type = type;
    }

    const events = await prisma.event.findMany({
      where,
      include: {
        organizer: {
          select: {
            firstName: true,
            lastName: true,
            profile: {
              select: { avatar: true }
            }
          }
        },
        _count: {
          select: { registrations: true }
        }
      },
      orderBy: { startDate: 'asc' }
    });

    return events;
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Internal server error' });
  }
});

// Get single event
fastify.get('/events/:id', async (request, reply) => {
  const { id } = request.params;
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        organizer: {
          select: {
            firstName: true,
            lastName: true,
            profile: {
              select: { avatar: true, bio: true }
            }
          }
        },
        tickets: true,
        registrations: true,
        _count: {
          select: { registrations: true }
        }
      }
    });

    if (!event) {
      return reply.code(404).send({ message: 'Event not found' });
    }

    return event;
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Internal server error' });
  }
});

// Register for event
fastify.post('/events/:id/register', async (request, reply) => {
  const { id: eventId } = request.params;
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.code(401).send({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    // Check if already registered
    const existing = await prisma.eventRegistration.findUnique({
      where: {
        eventId_userId: { eventId, userId }
      }
    });

    if (existing) {
      return reply.code(400).send({ message: 'You are already registered for this event.' });
    }

    // Create registration
    const registration = await prisma.eventRegistration.create({
      data: {
        eventId,
        userId,
        qrCode: `EVT-${eventId.slice(0, 4)}-USR-${userId.slice(0, 4)}-${Date.now()}`
      }
    });

    return { message: 'Registration successful!', registration };
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Internal server error' });
  }
});

// Get current user's events
fastify.get('/users/me/events', async (request, reply) => {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.code(401).send({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    const registrations = await prisma.eventRegistration.findMany({
      where: { userId },
      include: {
        event: {
          include: {
            organizer: {
              select: { firstName: true, lastName: true }
            }
          }
        }
      },
      orderBy: { event: { startDate: 'asc' } }
    });

    return registrations.map(r => ({
      ...r.event,
      registrationId: r.id,
      registeredAt: r.registeredAt,
      checkedIn: r.checkedIn
    }));
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Internal server error' });
  }
});

// --- FORUM ROUTES ---

// Get all forum categories
fastify.get('/forum/categories', async (request, reply) => {
  return [
    { id: 'general', name: 'General Discussion', description: 'Anything and everything about diversity.' },
    { id: 'career', name: 'Career & Mentorship', description: 'Grow your career with community support.' },
    { id: 'inclusion', name: 'Inclusion & Belonging', description: 'Sharing best practices and personal stories.' },
    { id: 'news', name: 'Community News', description: 'Latest updates from the Diversity Network.' }
  ];
});

// Get all forum posts
fastify.get('/forum/posts', async (request, reply) => {
  try {
    const { category, search } = request.query;
    const where = {};

    if (category && category !== 'all') {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ];
    }

    const posts = await prisma.forumPost.findMany({
      where,
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            profile: { select: { avatar: true } }
          }
        },
        _count: {
          select: { comments: true, likes: true }
        }
      },
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return posts;
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Internal server error' });
  }
});

// Get single forum post
fastify.get('/forum/posts/:id', async (request, reply) => {
  const { id } = request.params;
  try {
    const post = await prisma.forumPost.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            profile: { select: { avatar: true, bio: true } }
          }
        },
        comments: {
          include: {
            author: {
              select: {
                firstName: true,
                lastName: true,
                profile: { select: { avatar: true } }
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        },
        _count: {
          select: { likes: true }
        }
      }
    });

    if (!post) {
      return reply.code(404).send({ message: 'Post not found' });
    }

    // Increment views
    await prisma.forumPost.update({
      where: { id },
      data: { views: { increment: 1 } }
    });

    return post;
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Internal server error' });
  }
});

// Create forum post
fastify.post('/forum/posts', async (request, reply) => {
  const { title, content, category, tags } = request.body;
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.code(401).send({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const authorId = decoded.userId;

    const post = await prisma.forumPost.create({
      data: {
        title,
        content,
        category,
        tags: tags || [],
        authorId
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            profile: { select: { avatar: true } }
          }
        },
        _count: {
          select: { comments: true, likes: true }
        }
      }
    });

    // Award impact points for creating a post
    await prisma.userProfile.update({
      where: { userId: authorId },
      data: { impactPoints: { increment: 5 } }
    });

    return post;
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Internal server error' });
  }
});

// Add comment to forum post
fastify.post('/forum/posts/:id/comments', async (request, reply) => {
  const { id: postId } = request.params;
  const { content, parentId } = request.body;
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.code(401).send({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const authorId = decoded.userId;

    const comment = await prisma.forumComment.create({
      data: {
        content,
        postId,
        authorId,
        parentId
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            profile: { select: { avatar: true } }
          }
        },
        post: {
          select: { authorId: true, title: true }
        }
      }
    });

    // Award impact points for creating a comment
    await prisma.userProfile.update({
      where: { userId: authorId },
      data: { impactPoints: { increment: 2 } }
    });

    // Notify post author if it's not their own comment
    if (comment.post.authorId !== authorId) {
      const prefs = await prisma.notificationPreferences.findUnique({
        where: { userId: comment.post.authorId }
      });
      if (!prefs || prefs.mentionsReplies) {
        await prisma.notification.create({
          data: {
            userId: comment.post.authorId,
            title: 'New Comment on Your Post',
            message: `${comment.author.firstName} commented on your post "${comment.post.title}"`,
            type: 'comment',
            link: `/forums/${postId}`
          }
        });
      }
    }

    return comment;
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Internal server error' });
  }
});

// Toggle like on forum post
fastify.post('/forum/posts/:id/like', async (request, reply) => {
  const { id: postId } = request.params;
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.code(401).send({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    const existingLike = await prisma.forumLike.findUnique({
      where: {
        postId_userId: { postId, userId }
      }
    });

    if (existingLike) {
      await prisma.forumLike.delete({
        where: { id: existingLike.id }
      });
      return { liked: false };
    } else {
      const newLike = await prisma.forumLike.create({
        data: { postId, userId },
        include: {
          post: { select: { authorId: true, title: true } },
          user: { select: { firstName: true, lastName: true } }
        }
      });

      // Award impact points for liking a post
      await prisma.userProfile.update({
        where: { userId },
        data: { impactPoints: { increment: 1 } }
      });

      // Notify post author if it's not their own like
      if (newLike.post.authorId !== userId) {
        const prefs = await prisma.notificationPreferences.findUnique({
          where: { userId: newLike.post.authorId }
        });
        if (!prefs || prefs.mentionsReplies) {
          await prisma.notification.create({
            data: {
              userId: newLike.post.authorId,
              title: 'New Like on Your Post',
              message: `${newLike.user.firstName} liked your post "${newLike.post.title}"`,
              type: 'like',
              link: `/forums/${postId}`
            }
          });
        }
      }

      return { liked: true };
    }
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Internal server error' });
  }
});

// Reset Password Route
fastify.post('/reset-password', async (request, reply) => {
  const { token, password } = request.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      return reply.code(400).send({ message: 'Invalid or expired reset token' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null
      }
    });

    return { message: 'Password reset successful! You can now log in.' };
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Internal server error' });
  }
});

// --- Resources API ---

// Get all resources with filtering
fastify.get('/resources', async (request, reply) => {
  const { category, type, search, language } = request.query;
  try {
    const where = { isPublished: true };

    if (category && category !== 'all') {
      where.category = category;
    }
    if (type && type !== 'all') {
      where.type = type;
    }
    if (language) {
      where.language = language;
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } }
      ];
    }

    const resources = await prisma.resource.findMany({
      where,
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            profile: { select: { avatar: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return resources;
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Internal server error' });
  }
});

// Get unique resource categories and types
fastify.get('/resources/meta', async (request, reply) => {
  try {
    const resources = await prisma.resource.findMany({
      where: { isPublished: true },
      select: { category: true, type: true }
    });

    const categories = [...new Set(resources.map(r => r.category))];
    const types = [...new Set(resources.map(r => r.type))];

    return { categories, types };
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Internal server error' });
  }
});

// --- Business Directory API ---

// Get all businesses with filtering
fastify.get('/businesses', async (request, reply) => {
  const { industry, badgeLevel, search } = request.query;
  try {
    const where = {
      verificationStatus: { in: ['VERIFIED', 'PENDING'] }
    };

    if (industry && industry !== 'all') {
      where.industry = industry;
    }
    if (badgeLevel && badgeLevel !== 'all') {
      where.badgeLevel = badgeLevel;
    }
    if (search) {
      where.OR = [
        { companyName: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const businesses = await prisma.business.findMany({
      where,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            profile: { select: { avatar: true } }
          }
        },
        _count: {
          select: { testimonials: true, corporateVolunteering: true }
        }
      },
      orderBy: { companyName: 'asc' }
    });

    return businesses;
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Internal server error' });
  }
});

// Get unique industries and sizes for filters
fastify.get('/businesses/meta', async (request, reply) => {
  try {
    const industries = await prisma.business.findMany({
      where: { verificationStatus: { in: ['VERIFIED', 'PENDING'] } },
      select: { industry: true }
    });

    const uniqueIndustries = [...new Set(industries.map(b => b.industry))];

    return {
      industries: uniqueIndustries,
      badgeLevels: ['CHAMPION', 'INCLUSION_PARTNER', 'SUPPORTER']
    };
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Internal server error' });
  }
});

// Get single business
fastify.get('/businesses/:id', async (request, reply) => {
  const { id } = request.params;
  try {
    const business = await prisma.business.findUnique({
      where: { id },
      include: {
        ...includeBadgeData,
        user: {
          select: {
            firstName: true,
            lastName: true,
            profile: { select: { avatar: true, bio: true } }
          }
        },
        testimonials: {
          where: { isApproved: true },
          include: { user: { select: { firstName: true, lastName: true, profile: { select: { avatar: true } } } } }
        },
        _count: {
          select: { corporateVolunteering: true, sponsorships: true }
        }
      }
    });

    if (!business) {
      return reply.code(404).send({ message: 'Business not found' });
    }

    const badgeData = calculateBusinessBadges(business);
    return { ...business, ...badgeData };
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Internal server error' });
  }
});

// GET Current Business Profile
// GET Business Badges
fastify.get('/businesses/me/badges', async (request, reply) => {
  const decoded = authenticate(request, reply);
  if (!decoded) return;

  try {
    const business = await prisma.business.findUnique({
      where: { userId: decoded.userId },
      include: includeBadgeData
    });

    if (!business) return reply.code(403).send({ message: 'Unauthorized' });

    return calculateBusinessBadges(business);
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Failed to calculate badges' });
  }
});

fastify.get('/businesses/me', async (request, reply) => {
  const decoded = authenticate(request, reply);
  if (!decoded) return;

  try {
    const business = await prisma.business.findUnique({
      where: { userId: decoded.userId },
      include: {
        ...includeBadgeData,
        user: {
          include: {
            notifications: {
              orderBy: { createdAt: 'desc' },
              take: 20
            }
          }
        }
      }
    });

    if (!business) {
      return reply.code(404).send({ message: 'Business profile not found' });
    }

    const badgeData = calculateBusinessBadges(business);
    return { ...business, ...badgeData };
  } catch (error) {
    console.error('CRITICAL ERROR in /businesses/me:', error);
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Failed to fetch business profile', error: error.message });
  }
});

// PUT Update Current Business Profile
fastify.put('/businesses/me', async (request, reply) => {
  const decoded = authenticate(request, reply);
  if (!decoded) return;

  const {
    companyName,
    companyEmail,
    companyPhone,
    website,
    industry,
    size,
    description,
    logo,
    address,
    city,
    country,
    diversityCommitment,
    csrReport
  } = request.body;

  try {
    const updatedBusiness = await prisma.business.upsert({
      where: { userId: decoded.userId },
      update: {
        companyName,
        companyEmail,
        companyPhone,
        website,
        industry,
        size,
        description,
        logo,
        address,
        city,
        country,
        diversityCommitment,
        csrReport
      },
      create: {
        userId: decoded.userId,
        companyName: companyName || 'My Business',
        companyEmail: companyEmail || decoded.email,
        industry: industry || 'Other',
        size: size || '1-10'
      }
    });

    return updatedBusiness;
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Failed to update business profile' });
  }
});
// --- Employment Notices & Applications API ---

// GET All Employment Notices (Public)
fastify.get('/employment-notices', async (request, reply) => {
  try {
    const notices = await prisma.employmentNotice.findMany({
      include: {
        business: {
          select: {
            companyName: true,
            logo: true,
            industry: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return notices;
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Failed to fetch employment notices' });
  }
});

// POST Create Employment Notice (Business Only)
fastify.post('/employment-notices', async (request, reply) => {
  const decoded = authenticate(request, reply);
  if (!decoded) return;

  const { title, description, location, type, salary, requirements } = request.body;

  try {
    const business = await prisma.business.findUnique({
      where: { userId: decoded.userId }
    });

    if (!business) {
      return reply.code(403).send({ message: 'Only businesses can post notices' });
    }

    const notice = await prisma.employmentNotice.create({
      data: {
        businessId: business.id,
        title,
        description,
        location,
        type,
        salary,
        requirements: requirements || []
      }
    });

    return notice;
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Failed to create employment notice' });
  }
});

// GET My Employment Notices (Business Only)
fastify.get('/businesses/me/employment-notices', async (request, reply) => {
  const decoded = authenticate(request, reply);
  if (!decoded) return;

  try {
    const business = await prisma.business.findUnique({
      where: { userId: decoded.userId }
    });

    if (!business) {
      return reply.code(403).send({ message: 'Only businesses can view their notices' });
    }

    const notices = await prisma.employmentNotice.findMany({
      where: { businessId: business.id },
      include: {
        _count: {
          select: { applications: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return notices;
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Failed to fetch notices' });
  }
});

// POST Apply for Notice (User)
fastify.post('/employment-notices/:id/apply', async (request, reply) => {
  const decoded = authenticate(request, reply);
  if (!decoded) return;

  const { id } = request.params;
  const { resumeUrl, coverLetter } = request.body;

  try {
    const application = await prisma.employmentApplication.create({
      data: {
        noticeId: id,
        userId: decoded.userId,
        resumeUrl,
        coverLetter
      },
      include: {
        notice: {
          include: { business: true }
        }
      }
    });

    // Notify business
    await prisma.notification.create({
      data: {
        userId: application.notice.business.userId,
        title: 'New Job Application',
        message: `A new application has been received for the position: ${application.notice.title}.`,
        type: 'info',
        link: `/business/applications` // Assuming this route exists or will exist
      }
    });

    return application;
  } catch (error) {
    // Handle unique constraint (already applied)
    if (error.code === 'P2002') {
      return reply.code(400).send({ message: 'You have already applied for this position' });
    }
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Failed to submit application' });
  }
});

// GET Business Applications (Business Only)
fastify.get('/businesses/me/applications', async (request, reply) => {
  const decoded = authenticate(request, reply);
  if (!decoded) return;

  try {
    const business = await prisma.business.findUnique({
      where: { userId: decoded.userId }
    });

    if (!business) return reply.code(403).send({ message: 'Unauthorized' });

    const applications = await prisma.employmentApplication.findMany({
      where: {
        notice: { businessId: business.id }
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            profile: {
              select: { avatar: true }
            }
          }
        },
        notice: {
          select: { title: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return applications;
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Failed to fetch applications' });
  }
});

// PATCH Update Application Status (Hire Flow)
fastify.patch('/applications/:id', async (request, reply) => {
  const decoded = authenticate(request, reply);
  if (!decoded) return;

  const { id } = request.params;
  const { status } = request.body; // ACCEPTED, REJECTED, etc.

  try {
    const application = await prisma.employmentApplication.findUnique({
      where: { id },
      include: { notice: true }
    });

    if (!application) return reply.code(404).send({ message: 'Application not found' });

    // Verify ownership
    const business = await prisma.business.findUnique({
      where: { userId: decoded.userId }
    });
    if (!business || application.notice.businessId !== business.id) {
      return reply.code(403).send({ message: 'Unauthorized' });
    }

    const updated = await prisma.employmentApplication.update({
      where: { id },
      data: { status }
    });

    // If accepted, mark user as employee
    if (status === 'ACCEPTED') {
      await prisma.user.update({
        where: { id: application.userId },
        data: { employedAtId: business.id }
      });
    }

    return updated;
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Failed to update application' });
  }
});

// PUT Update Employment Notice
fastify.put('/employment-notices/:id', async (request, reply) => {
  const decoded = authenticate(request, reply);
  if (!decoded) return;

  const { id } = request.params;
  const { title, description, location, type, salary, requirements } = request.body;

  try {
    const business = await prisma.business.findUnique({
      where: { userId: decoded.userId }
    });
    if (!business) return reply.code(403).send({ message: 'Unauthorized' });

    const updated = await prisma.employmentNotice.update({
      where: { id, businessId: business.id },
      data: {
        title,
        description,
        location,
        type,
        salary,
        requirements: requirements || []
      }
    });

    return updated;
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Failed to update notice' });
  }
});

// DELETE Employment Notice
fastify.delete('/employment-notices/:id', async (request, reply) => {
  const decoded = authenticate(request, reply);
  if (!decoded) return;

  const { id } = request.params;

  try {
    const business = await prisma.business.findUnique({
      where: { userId: decoded.userId }
    });
    if (!business) return reply.code(403).send({ message: 'Unauthorized' });

    await prisma.employmentNotice.delete({
      where: { id, businessId: business.id }
    });

    return { message: 'Notice deleted successfully' };
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Failed to delete notice' });
  }
});


// --- Business Training (Courses) API ---

// GET All Courses authored by this business
fastify.get('/businesses/me/courses', async (request, reply) => {
  const decoded = authenticate(request, reply);
  if (!decoded) return;

  try {
    const business = await prisma.business.findUnique({
      where: { userId: decoded.userId }
    });
    if (!business) return reply.code(403).send({ message: 'Unauthorized' });

    const courses = await prisma.course.findMany({
      where: { authorBusinessId: business.id },
      include: {
        _count: {
          select: { enrollments: true, modules: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return courses;
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Failed to fetch business courses' });
  }
});

// POST Create a new Business Course
fastify.post('/businesses/me/courses', async (request, reply) => {
  const decoded = authenticate(request, reply);
  if (!decoded) return;

  const { title, description, level, duration, category, tags, thumbnail } = request.body;

  try {
    const business = await prisma.business.findUnique({
      where: { userId: decoded.userId }
    });
    if (!business) return reply.code(403).send({ message: 'Unauthorized' });

    const course = await prisma.course.create({
      data: {
        title,
        description,
        level: level || 'BEGINNER',
        duration: parseInt(duration) || 0,
        category: category || 'Internal Training',
        tags: tags || [],
        thumbnail,
        authorBusinessId: business.id,
        type: 'INTERNAL',
        isPublished: true
      }
    });

    return course;
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Failed to create training course' });
  }
});

// DELETE Business Course
fastify.delete('/courses/:id', async (request, reply) => {
  const decoded = authenticate(request, reply);
  if (!decoded) return;

  const { id } = request.params;

  try {
    const business = await prisma.business.findUnique({
      where: { userId: decoded.userId }
    });
    if (!business) return reply.code(403).send({ message: 'Unauthorized' });

    const course = await prisma.course.findFirst({
      where: { id, authorBusinessId: business.id }
    });
    if (!course) return reply.code(404).send({ message: 'Course not found' });

    await prisma.course.delete({ where: { id } });
    return { message: 'Course deleted successfully' };
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Failed to delete course' });
  }
});

// GET Business Training Enrollment Stats
fastify.get('/businesses/me/training-stats', async (request, reply) => {
  const decoded = authenticate(request, reply);
  if (!decoded) return;

  try {
    const business = await prisma.business.findUnique({
        where: { userId: decoded.userId },
        include: { employees: true }
    });
    if (!business) return reply.code(403).send({ message: 'Unauthorized' });

    const courses = await prisma.course.findMany({
        where: { authorBusinessId: business.id },
        include: {
            enrollments: {
                include: { user: { select: { firstName: true, lastName: true, email: true } } }
            }
        }
    });

    return {
        totalCourses: courses.length,
        totalEnrollments: courses.reduce((sum, c) => sum + c.enrollments.length, 0),
        activeEmployees: business.employees.length,
        courses: courses.map(c => ({
            id: c.id,
            title: c.title,
            enrollmentCount: c.enrollments.length,
            completions: c.enrollments.filter(e => e.progress === 100).length
        }))
    };
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Failed to fetch training stats' });
  }
});

// --- Business Volunteering API ---

// GET All Volunteer Tasks posted by this business
fastify.get('/businesses/me/volunteer-tasks', async (request, reply) => {
  const decoded = authenticate(request, reply);
  if (!decoded) return;

  try {
    const business = await prisma.business.findUnique({
      where: { userId: decoded.userId }
    });
    if (!business) return reply.code(403).send({ message: 'Unauthorized' });

    const tasks = await prisma.volunteerTask.findMany({
      where: { businessId: business.id },
      include: {
        _count: {
          select: { assignments: true, volunteerHours: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return tasks;
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Failed to fetch business volunteer tasks' });
  }
});

// GET Volunteers for a specific task (business view)
fastify.get('/volunteer-tasks/:id/volunteers', async (request, reply) => {
  const decoded = authenticate(request, reply);
  if (!decoded) return;

  const { id } = request.params;

  try {
    const business = await prisma.business.findUnique({
      where: { userId: decoded.userId }
    });
    if (!business) return reply.code(403).send({ message: 'Unauthorized' });

    const task = await prisma.volunteerTask.findFirst({
      where: { id, businessId: business.id }
    });
    if (!task) return reply.code(404).send({ message: 'Task not found' });

    const assignments = await prisma.volunteerAssignment.findMany({
      where: { taskId: id },
      include: {
        volunteer: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                profile: { select: { avatar: true, bio: true } }
              }
            }
          }
        }
      },
      orderBy: { assignedAt: 'desc' }
    });

    return assignments.map(a => ({
      id: a.id,
      status: a.status,
      assignedAt: a.assignedAt,
      completedAt: a.completedAt,
      volunteer: {
        firstName: a.volunteer.user.firstName,
        lastName: a.volunteer.user.lastName,
        email: a.volunteer.user.email,
        avatar: a.volunteer.user.profile?.avatar,
        bio: a.volunteer.user.profile?.bio
      }
    }));
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Failed to fetch volunteers' });
  }
});

// POST Create a new Volunteer Task
fastify.post('/businesses/me/volunteer-tasks', async (request, reply) => {
  const decoded = authenticate(request, reply);
  if (!decoded) return;

  const { title, description, project, startDate, endDate, hours } = request.body;

  try {
    const business = await prisma.business.findUnique({
      where: { userId: decoded.userId }
    });
    if (!business) return reply.code(403).send({ message: 'Unauthorized' });

    const task = await prisma.volunteerTask.create({
      data: {
        title,
        description,
        project,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        hours: parseInt(hours) || 0,
        businessId: business.id,
        status: 'OPEN'
      }
    });

    return task;
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Failed to create volunteer task' });
  }
});

// POST Register Interest for Volunteer Task
fastify.post('/volunteer-tasks/:id/interest', async (request, reply) => {
  const decoded = authenticate(request, reply);
  if (!decoded) return;

  const { id } = request.params;

  try {
    const task = await prisma.volunteerTask.findUnique({
      where: { id },
      include: { business: true }
    });

    if (!task) {
      return reply.code(404).send({ message: 'Volunteer task not found' });
    }

    // Ensure user has a Volunteer profile
    let volunteer = await prisma.volunteer.findUnique({
      where: { userId: decoded.userId }
    });

    if (!volunteer) {
      volunteer = await prisma.volunteer.create({
        data: { userId: decoded.userId }
      });
    }

    // Check if already assigned
    const existingAssignment = await prisma.volunteerAssignment.findFirst({
      where: {
        taskId: id,
        volunteerId: volunteer.id
      }
    });

    if (existingAssignment) {
      return reply.code(400).send({ message: 'You have already registered interest for this task' });
    }

    // Create assignment
    await prisma.volunteerAssignment.create({
      data: {
        taskId: id,
        volunteerId: volunteer.id,
        status: 'ASSIGNED'
      }
    });

    // Create a notification for the business owner
    if (task.business) {
      await prisma.notification.create({
        data: {
          userId: task.business.userId,
          title: 'New Volunteer Interest',
          message: `A community member has shown interest in your volunteer task: ${task.title}.`,
          type: 'info',
          link: `/business/volunteering`
        }
      });
    }

    return { message: 'Interest registered successfully' };
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Failed to register interest' });
  }
});

// GET Current Volunteer Assignments
fastify.get('/volunteers/me/tasks', async (request, reply) => {
  const decoded = authenticate(request, reply);
  if (!decoded) return;

  try {
    const volunteer = await prisma.volunteer.findUnique({
      where: { userId: decoded.userId }
    });

    if (!volunteer) {
      return [];
    }

    const assignments = await prisma.volunteerAssignment.findMany({
      where: { volunteerId: volunteer.id },
      include: {
        task: {
          include: { business: true }
        }
      },
      orderBy: { assignedAt: 'desc' }
    });

    return assignments;
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Failed to fetch assignments' });
  }
});

// DELETE Volunteer Task
fastify.delete('/volunteer-tasks/:id', async (request, reply) => {
  const decoded = authenticate(request, reply);
  if (!decoded) return;

  const { id } = request.params;

  try {
    const business = await prisma.business.findUnique({
      where: { userId: decoded.userId }
    });
    if (!business) return reply.code(403).send({ message: 'Unauthorized' });

    const task = await prisma.volunteerTask.findFirst({
      where: { id, businessId: business.id }
    });
    if (!task) return reply.code(404).send({ message: 'Task not found' });

    await prisma.volunteerTask.delete({ where: { id } });
    return { message: 'Task deleted successfully' };
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Failed to delete volunteer task' });
  }
});

// GET Business Volunteering Impact Stats
fastify.get('/businesses/me/volunteering-stats', async (request, reply) => {
  const decoded = authenticate(request, reply);
  if (!decoded) return;

  try {
    const business = await prisma.business.findUnique({
      where: { userId: decoded.userId }
    });
    if (!business) return reply.code(403).send({ message: 'Unauthorized' });

    const tasks = await prisma.volunteerTask.findMany({
      where: { businessId: business.id },
      include: {
        volunteerHours: true,
        assignments: true
      }
    });

    const corporateLogs = await prisma.corporateVolunteering.findMany({
      where: { businessId: business.id }
    });

    const totalTaskHours = tasks.reduce((sum, t) => 
        sum + t.volunteerHours.reduce((hSum, h) => hSum + h.hours, 0), 0);
    const totalCorporateHours = corporateLogs.reduce((sum, log) => sum + log.hours, 0);

    return {
      totalTasks: tasks.length,
      activeTasks: tasks.filter(t => t.status === 'OPEN').length,
      totalHours: totalTaskHours + totalCorporateHours,
      totalVolunteers: new Set([
        ...tasks.flatMap(t => t.assignments.map(a => a.volunteerId)),
        ...corporateLogs.map(l => l.volunteerId)
      ]).size,
      impactTrend: [
        { month: 'Jan', hours: 0 },
        { month: 'Feb', hours: 0 },
        { month: 'Mar', hours: totalTaskHours + totalCorporateHours }
      ]
    };
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Failed to fetch volunteering stats' });
  }
});

// --- Business Sponsorship API ---

// GET All Sponsorships for this business
fastify.get('/businesses/me/sponsorships', async (request, reply) => {
  const decoded = authenticate(request, reply);
  if (!decoded) return;

  try {
    const business = await prisma.business.findUnique({
      where: { userId: decoded.userId }
    });
    if (!business) return reply.code(403).send({ message: 'Unauthorized' });

    const sponsorships = await prisma.sponsorship.findMany({
      where: { businessId: business.id },
      include: {
        project: true
      },
      orderBy: { sponsoredAt: 'desc' }
    });
    return sponsorships;
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Failed to fetch sponsorships' });
  }
});

// POST Create a new Sponsorship (Initiate Stripe Checkout)
fastify.post('/businesses/me/sponsorships', async (request, reply) => {
  const decoded = authenticate(request, reply);
  if (!decoded) return;

  const { projectId, amount, message } = request.body;
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

  try {
    const business = await prisma.business.findUnique({
      where: { userId: decoded.userId }
    });
    if (!business) return reply.code(403).send({ message: 'Unauthorized' });

    const project = await prisma.communityProject.findUnique({
      where: { id: projectId }
    });
    if (!project) return reply.code(404).send({ message: 'Project not found' });

    // Create a pending sponsorship record
    const sponsorship = await prisma.sponsorship.create({
      data: {
        businessId: business.id,
        projectId,
        amount: parseFloat(amount),
        message,
        status: 'PENDING'
      }
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Sponsorship for ${project.title}`,
              description: message || 'Corporate Sponsorship'
            },
            unit_amount: Math.round(parseFloat(amount) * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/business/sponsorships?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/business/sponsorships?canceled=true`,
      metadata: {
        sponsorshipId: sponsorship.id,
        businessId: business.id,
        projectId: projectId
      }
    });

    // Update sponsorship with session ID
    await prisma.sponsorship.update({
      where: { id: sponsorship.id },
      data: { stripeSessionId: session.id }
    });

    return { url: session.url };
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Failed to initiate sponsorship payment' });
  }
});

// Stripe Webhook
fastify.post('/webhooks/stripe', { config: { rawBody: true } }, async (request, reply) => {
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  const sig = request.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(request.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    fastify.log.error(`Webhook Error: ${err.message}`);
    return reply.code(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { sponsorshipId, projectId } = session.metadata;

    try {
      await prisma.$transaction(async (tx) => {
        // Approve sponsorship
        await tx.sponsorship.update({
          where: { id: sponsorshipId },
          data: { 
            status: 'APPROVED',
            approvedAt: new Date()
          }
        });

        // Update project raised amount
        await tx.communityProject.update({
          where: { id: projectId },
          data: {
            raised: { increment: session.amount_total / 100 }
          }
        });
      });
      fastify.log.info(`Sponsorship ${sponsorshipId} approved via Stripe`);
    } catch (error) {
      fastify.log.error(`Error updating sponsorship after webhook: ${error.message}`);
    }
  }

  return { received: true };
});

// GET Business Sponsorship Stats
fastify.get('/businesses/me/sponsorship-stats', async (request, reply) => {
  const decoded = authenticate(request, reply);
  if (!decoded) return;

  try {
    const business = await prisma.business.findUnique({
      where: { userId: decoded.userId }
    });
    if (!business) return reply.code(403).send({ message: 'Unauthorized' });

    const sponsorships = await prisma.sponsorship.findMany({
      where: { businessId: business.id }
    });

    const totalSponsored = sponsorships.reduce((sum, s) => sum + s.amount, 0);
    const uniqueProjects = new Set(sponsorships.map(s => s.projectId)).size;

    return {
      totalSponsored,
      uniqueProjects,
      impactReach: uniqueProjects * 500, // Mock impact metric
      history: sponsorships.map(s => ({
          date: s.sponsoredAt,
          amount: s.amount
      }))
    };
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Failed to fetch sponsorship stats' });
  }
});

// GET Available Community Projects
fastify.get('/community/projects/available', async (request, reply) => {
  try {
    const projects = await prisma.communityProject.findMany({
      where: { 
        status: 'APPROVED',
        endDate: { gte: new Date() }
      },
      include: {
          _count: { select: { sponsorships: true } }
      }
    });
    return projects;
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Failed to fetch projects' });
  }
});

// GET Business Impact Report
fastify.get('/businesses/me/impact-report', async (request, reply) => {
  const decoded = authenticate(request, reply);
  if (!decoded) return;

  try {
    const business = await prisma.business.findUnique({
      where: { userId: decoded.userId },
      include: {
        employees: true,
        courses: {
          include: {
            enrollments: true
          }
        },
        volunteerTasks: {
          include: {
            volunteerHours: true,
            assignments: true
          }
        },
        sponsorships: {
          include: {
            project: true
          }
        }
      }
    });

    if (!business) return reply.code(403).send({ message: 'Unauthorized' });

    // Training Metrics
    const totalCourses = business.courses.length;
    const totalEnrollments = business.courses.reduce((sum, c) => sum + c.enrollments.length, 0);
    const completions = business.courses.reduce((sum, c) => 
      sum + c.enrollments.filter(e => e.progress === 100).length, 0);

    // Volunteering Metrics
    const totalTasks = business.volunteerTasks.length;
    const totalVolunteerHours = business.volunteerTasks.reduce((sum, t) => 
      sum + t.volunteerHours.reduce((hSum, h) => hSum + h.hours, 0), 0);
    const uniqueVolunteers = new Set(business.volunteerTasks.flatMap(t => 
      t.assignments.map(a => a.volunteerId))).size;

    // Sponsorship Metrics
    const totalSponsored = business.sponsorships.reduce((sum, s) => sum + s.amount, 0);
    const supportedProjects = new Set(business.sponsorships.map(s => s.projectId)).size;
    const estimatedReach = supportedProjects * 500; // Mock ROI

    // Generate monthly trend data (last 6 months)
    const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
    const trendData = months.map((month, index) => {
      // Mocking trend data based on actual totals for now
      const factor = (index + 1) / 6;
      return {
        month,
        training: Math.round(totalEnrollments * factor * 0.4),
        volunteering: Math.round(totalVolunteerHours * factor * 0.6),
        sponsorship: Math.round(totalSponsored * factor * 0.5)
      };
    });

    return {
      summary: {
        totalInvestment: totalSponsored + (totalVolunteerHours * 25) + (totalEnrollments * 50), // Mock fiscal value
        totalHours: totalVolunteerHours,
        totalLearners: totalEnrollments,
        impactReach: estimatedReach + (totalVolunteerHours * 10),
      },
      training: {
        totalCourses,
        totalEnrollments,
        completions,
        engagementRate: totalEnrollments > 0 ? (completions / totalEnrollments) * 100 : 0
      },
      volunteering: {
        totalTasks,
        totalHours: totalVolunteerHours,
        uniqueVolunteers,
        avgHoursPerTask: totalTasks > 0 ? totalVolunteerHours / totalTasks : 0
      },
      sponsorship: {
        totalAmount: totalSponsored,
        projectCount: supportedProjects,
        reach: estimatedReach
      },
      charts: {
        trend: trendData,
        breakdown: [
          { name: 'Training', value: totalEnrollments * 50 },
          { name: 'Volunteering', value: totalVolunteerHours * 25 },
          { name: 'Sponsorship', value: totalSponsored }
        ],
        sectorImpact: [
          { sector: 'Education', value: totalCourses * 10 + supportedProjects * 5 },
          { sector: 'Environment', value: totalTasks * 8 },
          { sector: 'Equality', value: totalSponsored / 100 },
          { sector: 'Health', value: uniqueVolunteers * 2 }
        ]
      }
    };
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Failed to generate impact report' });
  }
});



// --- Volunteer Discovery API ---

// Get all volunteer tasks with filtering
fastify.get('/community/volunteer/tasks', async (request, reply) => {
  const { project, status, search } = request.query;
  try {
    const where = {};

    if (project && project !== 'all') {
      where.project = project;
    }
    if (status && status !== 'all') {
      where.status = status;
    } else {
      where.status = 'OPEN'; // Default to open tasks
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const tasks = await prisma.volunteerTask.findMany({
      where,
      include: {
        assignments: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Check for optional authentication to mark registered tasks
    const authHeader = request.headers.authorization;
    let userId = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.userId;
      } catch (err) {
        // Ignore invalid token for this public endpoint
      }
    }

    if (userId) {
      // Find the volunteer record if it exists
      const volunteer = await prisma.volunteer.findUnique({
        where: { userId }
      });

      return tasks.map(task => ({
        ...task,
        isRegistered: volunteer ? task.assignments.some(a => a.volunteerId === volunteer.id) : false,
        assignments: undefined // Hide internal assignments data
      }));
    }

    return tasks.map(task => ({
      ...task,
      isRegistered: false,
      assignments: undefined
    }));
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Internal server error' });
  }
});

// Get unique projects and metadata for filters
fastify.get('/community/volunteer/meta', async (request, reply) => {
  try {
    const tasks = await prisma.volunteerTask.findMany({
      select: { project: true }
    });

    const uniqueProjects = [...new Set(tasks.map(t => t.project).filter(Boolean))];

    // Get some basic impact stats for the hero section
    const [totalTasks, totalHours] = await Promise.all([
      prisma.volunteerTask.count({ where: { status: 'OPEN' } }),
      prisma.volunteerTask.aggregate({
        _sum: { hours: true },
        where: { status: 'COMPLETED' }
      })
    ]);

    return {
      projects: uniqueProjects,
      stats: {
        openOpportunities: totalTasks,
        completedHours: totalHours._sum.hours || 0,
        activeVolunteers: await prisma.volunteer.count()
      }
    };
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Internal server error' });
  }
});

// --- Announcement Discovery API ---

// Get all announcements with optional filtering by type
fastify.get('/community/announcements', async (request, reply) => {
  const { type } = request.query;
  try {
    const where = {};
    if (type && type !== 'all') {
      where.type = type;
    }

    const announcements = await prisma.announcement.findMany({
      where,
      orderBy: [
        { priority: 'desc' }, // Order by priority (mapped in the frontend)
        { publishedAt: 'desc' }
      ],
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            profile: {
              select: { avatar: true }
            }
          }
        }
      }
    });

    return announcements;
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Internal server error' });
  }
});

// --- Network Connect API ---

// Get paginated network directory with filtering
fastify.get('/community/network', async (request, reply) => {
  const { role, skill, search, page = 1, limit = 12 } = request.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  let currentUserId = null;
  const authHeader = request.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      currentUserId = decoded.userId;
    } catch (e) { /* ignore invalid token */ }
  }
  
  try {
    const where = {};
    const userWhere = {};
    
    if (role && role !== 'all') {
      userWhere.role = role;
    }
    
    if (search) {
      userWhere.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (skill && skill !== 'all') {
      where.skills = { has: skill };
    }
    
    const [profiles, totalCount] = await Promise.all([
      prisma.userProfile.findMany({
        where: {
          ...where,
          user: Object.keys(userWhere).length > 0 ? userWhere : undefined
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true
            }
          }
        },
        skip,
        take: parseInt(limit),
        orderBy: { impactPoints: 'desc' }
      }),
      prisma.userProfile.count({
        where: {
          ...where,
          user: Object.keys(userWhere).length > 0 ? userWhere : undefined
        }
      })
    ]);

    // If logged in, fetch connection statuses
    let enhancedProfiles = profiles;
    if (currentUserId) {
      const connections = await prisma.connection.findMany({
        where: {
          OR: [
            { requesterId: currentUserId },
            { recipientId: currentUserId }
          ]
        }
      });

      enhancedProfiles = profiles.map(profile => {
        const connection = connections.find(c => 
          (c.requesterId === currentUserId && c.recipientId === profile.user.id) ||
          (c.requesterId === profile.user.id && c.recipientId === currentUserId)
        );
        
        return {
          ...profile,
          connectionStatus: connection ? connection.status : 'NONE',
          isRequester: connection?.requesterId === currentUserId
        };
      });
    }

    return { 
      profiles: enhancedProfiles, 
      meta: { 
        totalCount, 
        currentPage: parseInt(page), 
        totalPages: Math.ceil(totalCount / parseInt(limit)) 
      } 
    };
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Internal server error' });
  }
});

// Get metadata for frontend filters
fastify.get('/community/network/meta', async (request, reply) => {
  try {
    const profiles = await prisma.userProfile.findMany({
      select: { skills: true }
    });
    
    const allSkills = profiles.flatMap(p => p.skills);
    const uniqueSkills = [...new Set(allSkills)].sort();
    
    // Hardcoded roles for now based on schema
    const roles = ['COMMUNITY_MEMBER', 'BUSINESS', 'LEARNER', 'VOLUNTEER', 'ADMIN', 'MODERATOR'];
    
    return {
      skills: uniqueSkills,
      roles: roles
    };
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Internal server error' });
  }
});

// Get all accepted connections for the current user
fastify.get('/community/connections', async (request, reply) => {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.code(401).send({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    const connections = await prisma.connection.findMany({
      where: {
        status: 'ACCEPTED',
        OR: [
          { requesterId: userId },
          { recipientId: userId }
        ]
      },
      include: {
        requester: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
            profile: {
              select: {
                avatar: true,
                bio: true,
                city: true,
                country: true,
                skills: true,
                impactPoints: true
              }
            }
          }
        },
        recipient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
            profile: {
              select: {
                avatar: true,
                bio: true,
                city: true,
                country: true,
                skills: true,
                impactPoints: true
              }
            }
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    // Map to return the "other" user in the connection
    const connectedUsers = connections.map(conn => {
      const otherUser = conn.requesterId === userId ? conn.recipient : conn.requester;
      return {
        ...otherUser.profile,
        user: {
          id: otherUser.id,
          firstName: otherUser.firstName,
          lastName: otherUser.lastName,
          role: otherUser.role
        },
        connectionId: conn.id,
        connectedAt: conn.updatedAt
      };
    });

    return connectedUsers;
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Internal server error' });
  }
});
// --- Messaging API ---

// Get all conversations for the authenticated user
fastify.get('/community/conversations', async (request, reply) => {
  const decoded = authenticate(request, reply);
  if (!decoded) return;
  
  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: { id: decoded.userId }
        }
      },
      include: {
        participants: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
            profile: { select: { avatar: true } }
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { lastMessageAt: 'desc' }
    });
    
    return conversations;
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Internal server error' });
  }
});

// Get messages for a specific conversation
fastify.get('/community/conversations/:id/messages', async (request, reply) => {
  const decoded = authenticate(request, reply);
  if (!decoded) return;
  
  const { id } = request.params;
  
  try {
    // Verify user is part of the conversation
    const conversation = await prisma.conversation.findFirst({
      where: {
        id,
        participants: {
          some: { id: decoded.userId }
        }
      }
    });
    
    if (!conversation) {
      return reply.code(403).send({ message: 'Access denied' });
    }
    
    const messages = await prisma.message.findMany({
      where: { conversationId: id },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: { id: true, firstName: true, lastName: true }
        }
      }
    });

    // Mark messages as read by this user
    const unreadMessages = messages.filter(m => !m.readBy.includes(decoded.userId));
    if (unreadMessages.length > 0) {
        await Promise.all(unreadMessages.map(m => 
            prisma.message.update({
                where: { id: m.id },
                data: { readBy: { push: decoded.userId } }
            })
        ));
    }
    
    return messages;
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Internal server error' });
  }
});

// Send a new message
fastify.post('/community/messages', async (request, reply) => {
  const decoded = authenticate(request, reply);
  if (!decoded) return;
  
  const { recipientId, content, conversationId } = request.body;
  
  if (!content) {
    return reply.code(400).send({ message: 'Message content is required' });
  }
  
  try {
    let convId = conversationId;
    
    // If no conversation ID, find existing or create new between sender and recipient
    if (!convId) {
      if (!recipientId) return reply.code(400).send({ message: 'Recipient ID is required for a new conversation' });
      
      const existingConv = await prisma.conversation.findFirst({
        where: {
          AND: [
            { participants: { some: { id: decoded.userId } } },
            { participants: { some: { id: recipientId } } }
          ]
        }
      });
      
      if (existingConv) {
        convId = existingConv.id;
      } else {
        const newConv = await prisma.conversation.create({
          data: {
            participants: {
              connect: [{ id: decoded.userId }, { id: recipientId }]
            }
          }
        });
        convId = newConv.id;
      }
    }
    
    const message = await prisma.message.create({
      data: {
        content,
        senderId: decoded.userId,
        conversationId: convId,
        readBy: [decoded.userId]
      },
      include: {
        sender: {
          select: { id: true, firstName: true, lastName: true }
        }
      }
    });
    
    await prisma.conversation.update({
      where: { id: convId },
      data: { lastMessageAt: new Date() }
    });

    // Notify the recipient(s) other than the sender
    try {
      const conv = await prisma.conversation.findUnique({
        where: { id: convId },
        include: { participants: { select: { id: true } } }
      });

      const recipients = conv.participants.filter(p => p.id !== decoded.userId);
      const senderUser = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { firstName: true, lastName: true }
      });

      for (const recipient of recipients) {
        await prisma.notification.create({
          data: {
            userId: recipient.id,
            title: `New message from ${senderUser.firstName} ${senderUser.lastName}`,
            message: content.length > 60 ? content.slice(0, 60) + '...' : content,
            type: 'new_message',
            link: `/messages`,
            read: false
          }
        });
      }
    } catch (notifyError) {
      fastify.log.warn('Failed to create message notification:', notifyError);
    }
    
    return message;
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Internal server error' });
  }
});

// Start the server
const start = async () => {
  try {
    const port = 3001;
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`Server listening on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
