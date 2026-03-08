const fastify = require('fastify')({ logger: true });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('@fastify/cors');
require('dotenv').config();

const prisma = new PrismaClient();

// Register CORS
fastify.register(cors, {
  origin: true // In production, replace with your frontend URL
});

// Helper for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Register Route
fastify.post('/register', async (request, reply) => {
  const { email, password, firstName, lastName, role } = request.body;

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return reply.code(400).send({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: role || 'COMMUNITY_MEMBER'
      }
    });

    // Create a token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });

    return { token, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } };
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
