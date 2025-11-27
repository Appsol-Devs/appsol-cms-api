import { Server as IOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import type { ILogger } from "../logging/ILogger.js";
import type { IAuthService } from "../services/index.js";
import type { IUser } from "../../entities/User.js";

export function initSocket(
  logger: ILogger,
  authService: IAuthService,
  server: HTTPServer,
  opts?: { path?: string; cors?: any }
) {
  const io = new IOServer(server, {
    path: opts?.path ?? "/socket.io",
    cors: opts?.cors ?? { origin: "*" },
  });

  io.on("connection", (socket) => {
    // Handle authentication
    socket.on(
      "authenticate",
      async (payload: { token?: string; userId?: string }) => {
        try {
          if (payload?.token) {
            const user: IUser = await authService.verifyToken<IUser>(
              payload.token
            );
            const userId = user._id;
            if (userId) {
              const roomName = `user:${userId}`;
              // Check if socket is already in the room

              if (!socket.rooms.has(roomName)) {
                socket.join(roomName);
                logger.info(`User ${userId} joined room: ${roomName}`);
              } else {
                logger.info(`User ${userId} already in room: ${roomName}`);
              }

              socket.emit("authenticated", { ok: true });
            }
          } else if (payload?.userId) {
            const userId = payload.userId;
            const roomName = `user:${userId}`;
            // Check if socket is already in the room

            if (!socket.rooms.has(roomName)) {
              socket.join(roomName);
              logger.info(
                `Socket ${socket.id} joined room: user:${payload.userId}`
              );

              socket.emit("authenticated", { ok: true });
            } else {
              logger.info(`User ${userId} already in room: ${roomName}`);
            }
          } else {
            socket.emit("authenticated", { ok: false });
            // disconnect unauthorized clients
            socket.disconnect();
          }
        } catch (err) {
          socket.emit("authenticated", { ok: false, error: "auth_failed" });
          socket.disconnect();
        }
      }
    );

    // Handle disconnection
    socket.on("disconnect", (reason) => {
      logger.error(`Socket ${socket.id} disconnected: ${reason}`);
    });
  });

  return io;
}
