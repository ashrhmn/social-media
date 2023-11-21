require("dotenv").config();
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");
const cookie = require("cookie-parse");
const { createAdapter } = require("@socket.io/redis-streams-adapter");
const { createClient } = require("redis");
const { connect } = require("amqp-connection-manager");
const { instrument } = require("@socket.io/admin-ui");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = +(process.env.PORT || "3000");
const TOKEN_COOKIE_KEY = process.env.TOKEN_COOKIE_KEY || "token";
const redisUrl =
  process.env.SOCKET_ADAPTER_REDIS_URL || "redis://localhost:6379";
const amqpUrl = process.env.SOCKET_ADAPTER_AMQP_URL || "amqp://localhost";
const amqpExchange = process.env.SOCKET_ADAPTER_AMQP_EXCHANGE || "socket_event";

/**
 * A class representing a store for socket IDs
 * for managing socket IDs for a authenticated users
 */
class SocketIdStore {
  map = new Map();

  get(token) {
    return this.map.get(token) || [];
  }

  set(token, ids) {
    this.map.set(token, ids);
  }

  add(token, id) {
    if (!token) return;
    if (!id) return;
    const ids = this.get(token);
    ids.push(id);
    this.set(token, ids);
  }

  remove(token, id) {
    if (!token) return;
    if (!id) return;
    const ids = this.get(token);
    const index = ids.indexOf(id);
    if (index > -1) ids.splice(index, 1);
    this.set(token, ids);
  }
}

const bootstrap = async () => {
  // Setup NextJS Server
  const app = next({ dev, hostname, port });
  const handle = app.getRequestHandler();
  await app.prepare();

  // Setup HTTP Server and attach NextJS Server Handler
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      // console.log(req.url);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  });
  server.once("error", (err) => {
    console.error(err);
    process.exit(1);
  });

  // Setup Socket.IO Server with Redis Stream Adapter
  const redisClient = createClient({ url: redisUrl });
  await redisClient.connect();
  const io = new Server(server, {
    transports: ["websocket"],
    adapter: createAdapter(redisClient),
  });

  // Setup Socket.IO Admin UI (only in development)
  if (dev)
    instrument(io, {
      auth: false,
      mode: "development",
    });

  // Setup Socket.IO Socket ID Store, store and release socket ids for authenticated users
  const socketIdStore = new SocketIdStore();
  io.on("connection", (socket) => {
    const token = cookie.parse(socket.handshake.headers.cookie || "")[
      TOKEN_COOKIE_KEY
    ];
    socketIdStore.add(token, socket.id);
    socket.on("disconnect", () => socketIdStore.remove(token, socket.id));
  });

  // Setup AMQP Consumer for Socket.IO Events (fanout exchange)
  connect(amqpUrl).createChannel({
    json: true,
    setup: async (c) => {
      c.assertExchange(amqpExchange, "fanout", { durable: false });
      const { queue } = await c.assertQueue("", { exclusive: true });
      c.bindQueue(queue, amqpExchange, "");
      c.consume(queue, (message) => {
        if (!message) return;
        const content = (() => {
          try {
            return JSON.parse(message.content.toString());
          } catch (error) {
            console.error("Error serializing socket event message : ", error);
          }
        })();
        const event = content.event;
        if (!event) return;
        const tokens = content.tokens || [];
        const payload = content.payload || {};
        if (tokens.length === 0) io.emit(event, payload);
        else
          tokens.forEach((token) =>
            Array.from(new Set(socketIdStore.map.get(token))).forEach((id) =>
              io.to(id).emit(event, payload)
            )
          );
      });
    },
  });

  // Start HTTP Server
  server.listen(port, () =>
    console.log(`> Ready on http://${hostname}:${port}`)
  );
};

bootstrap();
