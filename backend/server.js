const fastify = require('fastify')({ logger: true });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('@fastify/cors');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
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

// Register CORS
fastify.register(cors, {
  origin: true
});

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

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
        verificationToken
      }
    });

    await sendVerificationEmail(email, firstName, verificationToken);

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });

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
  const { email, password } = request.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return reply.code(401).send({ message: 'Invalid credentials' });
    }

    if (!user.emailVerified) {
       return reply.code(403).send({ message: 'Please verify your email address before logging in.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return reply.code(401).send({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });

    return { token, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } };
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ message: 'Internal server error' });
  }
});

// Start the server
const start = async () => {
  try {
    const port = 4000;
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`Server listening on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
