import Fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import sensible from "@fastify/sensible";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import cors from "@fastify/cors";
import { authRoutes } from "./routes/auth.router.js";
import { initializeWorker } from "./queues/worker.js";
import { env } from "./config/env.js";

const server = Fastify({ logger: true });

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.register(helmet);

await server.register(cors, {
  origin: [env.FRONTEND_URL || "http://localhost:5173"],
  methods: ["GET", "POST", "OPTIONS"],
});

await server.register(rateLimit, {
  max: 100,
  timeWindow: "15 minutes",
});

server.register(sensible);
server.register(authRoutes, { prefix: "/auth" });

server.setErrorHandler((error, _request, reply) => {
  server.log.error(error);

  if (error.validation) {
    return reply.status(400).send({
      message: "Validation error",
      errors: error.validation,
    });
  }

  return reply.status(500).send({ message: "Internal Server Error" });
});

server.get("/", (_request, reply) => {
  reply.send({ message: "Keeper Auth Service (TypeScript) is running!" });
});

const start = async () => {
  try {
    const port = Number(env.SERVER_PORT) || 3000;
    await server.listen({ port });
    initializeWorker();
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
