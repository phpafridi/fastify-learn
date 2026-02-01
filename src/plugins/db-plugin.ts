// src/plugins/db-plugin.ts (Simplest approach)
import { type FastifyPluginAsync } from "fastify";
import { PrismaClient } from "@prisma/client";
import fp from "fastify-plugin";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

const dbPlugin: FastifyPluginAsync = async (fastify) => {
  // In Prisma 7+, DATABASE_URL from environment is automatically used
  // if no adapter or accelerateUrl is provided
  const prisma = new PrismaClient();

  await prisma.$connect();

  fastify.decorate("prisma", prisma);

  fastify.addHook("onClose", async (fastify) => {
    await fastify.prisma.$disconnect();
  });
};

export default fp(dbPlugin);