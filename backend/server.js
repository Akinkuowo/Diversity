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
      return reply.code(401).send({ message: 'Invalid credentials' });
    }

    if (!user.emailVerified) {
      return reply.code(403).send({ message: 'Please verify your email address before logging in.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return reply.code(401).send({ message: 'Invalid credentials' });
    }

    // Set expiration based on rememberMe
    const expiresIn = rememberMe ? '30d' : '1d';
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn });

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
            bio: true
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

// GET Community Posts
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
