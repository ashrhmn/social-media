import { io } from "socket.io-client";

export const socketClient = io({ transports: ["websocket"] });
