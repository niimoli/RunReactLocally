import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyCompress from "@fastify/compress";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, "dist");
const ASSETS_DIR = path.join(DIST_DIR, "assets");

const fastify = Fastify({
  logger: true,
});

await fastify.register(fastifyCompress);

await fastify.register(fastifyStatic, {
  root: ASSETS_DIR,
  prefix: "/assets/",
  maxAge: "1y",
  decorateReply: false,
});

fastify.get("/*", async (_req, reply) => {
  const indexPath = path.join(DIST_DIR, "index.html");
  return reply.type("text/html").send(await Bun.file(indexPath).text());
});

const PORT = Number(process.env.PORT || 80);

try {
  await fastify.listen({ port: PORT, host: "0.0.0.0" });
  console.log(`🚀 Server ready on http://localhost:${PORT}`);
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}