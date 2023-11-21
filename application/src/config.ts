export const AppConfig = {
  TOKEN_COOKIE_KEY: process.env.TOKEN_COOKIE_KEY || "token",
  NODE_ENV: process.env.NODE_ENV,
  PORT: +(process.env.PORT || "3000"),
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
  SOCKET_ADAPTER_REDIS_URL:
    process.env.SOCKET_ADAPTER_REDIS_URL || "redis://localhost:6379",
  SOCKET_ADAPTER_AMQP_EXCHANGE:
    process.env.SOCKET_ADAPTER_AMQP_EXCHANGE || "socket_event",
  SOCKET_ADAPTER_AMQP_URL:
    process.env.SOCKET_ADAPTER_AMQP_URL || "amqp://localhost",
  GENERIC_AMQP_URL: process.env.GENERIC_AMQP_URL || "amqp://localhost", // will be more classified
  STORAGE_SERVICE_ACCESS_KEY: process.env.STORAGE_SERVICE_ACCESS_KEY!,
  STORAGE_SERVICE_SECRET_KEY: process.env.STORAGE_SERVICE_SECRET_KEY!,
  STORAGE_SERVICE_ENDPOINT: process.env.STORAGE_SERVICE_ENDPOINT!,
  STORAGE_SERVICE_PORT: +process.env.STORAGE_SERVICE_PORT! || undefined,
  STORAGE_SERVICE_USE_SSL:
    process.env.STORAGE_SERVICE_USE_SSL?.toLowerCase() === "true",
  STORAGE_SERVICE_BUCKET_NAME: process.env.STORAGE_SERVICE_BUCKET_NAME!,
};
