import type { FastifyInstance } from 'fastify';
import { requestCodeSchema, verifyCodeSchema } from '../schemas/auth.schema.js';
import { requestCodeController, verifyCodeController } from '../controllers/auth.controller.js';

export async function authRoutes(server: FastifyInstance) {
  server.route({
    method: 'POST',
    url: '/request-code',
    schema: { body: requestCodeSchema },
    config: {
      rateLimit: {
        max: 5,
        timeWindow: '1 minute'
      }
    },
    handler: requestCodeController,
  });

  server.route({
    method: 'POST',
    url: '/verify-code',
    schema: { body: verifyCodeSchema },
    config: {
      rateLimit: {
        max: 10,
        timeWindow: '15 minutes'
      }
    },
    handler: verifyCodeController,
  });
}