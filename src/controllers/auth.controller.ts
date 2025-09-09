import type { FastifyRequest, FastifyReply } from "fastify";
import {
  requestVerificationCode,
  verifyCodeAndGetToken,
} from "../services/auth.service.js";

export async function requestCodeController(
  request: FastifyRequest<{ Body: { email: string } }>,
  reply: FastifyReply
) {
  await requestVerificationCode(request.body.email);
  return reply.send({ message: "Verification code sent successfully" });
}

export async function verifyCodeController(
  request: FastifyRequest<{ Body: { email: string; code: string } }>,
  reply: FastifyReply
) {
  try {
    const token = await verifyCodeAndGetToken(
      request.body.email,
      request.body.code
    );
    return reply.send({ token });
  } catch (error) {
    return reply.status(401).send({ error: (error as Error).message });
  }
}
