import Fastify from "fastify";
import HyperID from "hyperid";
import { QuickDB } from "quick.db";
import { resolve } from "path";

const server = Fastify({ logger: true }),
	hyperid = HyperID(),
	db = new QuickDB({ filePath: resolve(new URL(".", import.meta.url).pathname, "./db.sqlite") });

db.set("codes", {});
db.set("parties", {});

async function generateCodeID() {
	const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ12345678901234567890";
	let code = "";

	while (code.length < 8) code += possible.charAt(Math.floor(Math.random() * possible.length));
	if (await db.has(`codes.${code}`)) code = generateCodeID();

	return code;
}

async function generateTempAuth(code, nick) {
	const auth = hyperid();
	await db.set(`codes.${code}.players.${auth}`, nick);

	return auth;
}

server.post("/party/:game/create/", async (req, reply) => {
	if (!req.body.nickname) return reply.code(400).send({ message: "No nickname provided." });

	const code = await generateCodeID(),
		auth = hyperid();

	return reply.code(200).send(
		await db.set(`codes.${code}`, {
			createdAt: Date.now(),
			players: {
				[auth]: req.body.nickname,
			},
			admin: auth,
			game: req.params.game,
		}),
	);
});

server.post("/party/:id/join", async (req, reply) => {
	if (!req.body.code) return reply.code(400).send({ message: "No code provided." });
	if (!(await db.has(`codes.${req.body.code}`))) return reply.code(400).send({ message: "Invalid code provided." });
	if (!req.body.nickname) return reply.code(400).send({ message: "No nickname provided." });

	return reply.code(200).send({ auth: await generateTempAuth(req.body.code) });
});

server.delete("/party/:id/leave", async (req, reply) => {
	if (!req.headers.authorization) return reply.code(400).send({ message: "No authorization provided." });
	if (!(await db.has(`codes.${req.params.id}.players.${req.headers.authorization}`)))
		return reply.code(400).send({ message: "Invalid code or authorization provided." });

	await db.delete(`codes.${req.params.id}.${req.headers.authorization}`);

	return reply.code(200).send(true);
});

server.delete("/party/:id/delete", async (req, reply) => {
	if (!req.headers.authorization) return reply.code(400).send({ message: "No authorization provided." });
	if (!(await db.get(`codes.${req.params.id}.admin`) === req.headers.authorization))
		return reply.code(400).send({ message: "Unauthorized action." });

	await db.delete(`codes.${req.params.id}`);

	return reply.code(200).send(true);
});

server.post("/uno/new", (request, reply) => {
	if (!request.body.players)
		return reply.code(400).send({
			message: "No players provided.",
		});
	if (request.body.players.length > 4)
		return reply.code(400).send({
			message: "A maximum of 4 players are supported at the moment.",
		});

	return reply.code(200).send({
		id: hyperid(),
	});
});

server.listen({ port: 3000 }, (err, adr) => {
	if (err) throw err;
	else console.log(`Server is listening ${adr}`);
});
