import { injectable, inject } from "inversify";
import type { Express } from "express";
import type { Server as SocketIOServer } from "socket.io";
import http from "node:http";
import type { IConfig } from "../../config/IConfig.js";
import { INTERFACE_TYPE } from "../../utils/constants/bindings.js";
import type { ILogger } from "../logging/ILogger.js";
import type { IAuthService } from "../services/index.js";
import { initSocket } from "./socket.js";

export interface IServer {
  startServer(): void;
  getIO(): SocketIOServer;
  getHttpServer(): http.Server;
}

@injectable()
export class Server implements IServer {
  private httpServer: http.Server;
  private io: SocketIOServer;

  constructor(
    @inject(INTERFACE_TYPE.Express) private app: Express,
    @inject(INTERFACE_TYPE.IConfig) private config: IConfig,
    @inject(INTERFACE_TYPE.Logger) private logger: ILogger,
    @inject(INTERFACE_TYPE.AuthServiceImpl) private authService: IAuthService
  ) {
    this.httpServer = http.createServer(this.app);
    this.io = this.initializeSocket();
  }

  private initializeSocket(): SocketIOServer {
    const io = initSocket(this.logger, this.authService, this.httpServer, {
      cors: { origin: "*" },
    });
    this.app.set("io", io);
    return io;
  }

  public getIO(): SocketIOServer {
    return this.io;
  }

  public startServer(): void {
    this.httpServer.listen(this.config.port, () => {
      this.logger.info(`Server listening on Port ${this.config.port}`);
    });
  }

  public getHttpServer(): http.Server {
    return this.httpServer;
  }
}
