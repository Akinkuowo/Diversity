import Fastify from 'fastify';
import * as dotenv from 'dotenv';
import prismaPlugin from './plugins/prisma';

dotenv.config();

const fastify = Fastify({
  logger: true,
});

// Register plugins
fastify.register(prismaPlugin);

// Basic health check route
fastify.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3001;
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`Server is running on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
