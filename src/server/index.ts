import { connectDatabase } from "../database/db.init";
import app from "./app";
import config from "../config/config";
import * as http from "http";
import { Logger } from "../config/logger";
import { fetchCoins } from "../common/init-funcrions/fetchCoins";

class Server {
  public httpServer: http.Server;
  constructor() {
    this.httpServer = http.createServer(app);
  }

  async __init__() {
    app.listen(config.port, async () => {
      await connectDatabase();
      console.log("Starting application on port ", config.port);
      Logger.info("Adding coins to database");
      fetchCoins();
    });
  }

  exitHandler = () => {
    if (this.httpServer) {
      this.httpServer.close(() => {
        Logger.info("Server closed");
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };

  unexpectedErrorHandler = (error: Error) => {
    Logger.error(error);
    this.exitHandler();
  };
}

const server = new Server();
server.__init__();

process.on("uncaughtException", server.unexpectedErrorHandler);
process.on("unhandledRejection", server.unexpectedErrorHandler);

process.on("SIGTERM", () => {
  Logger.info("SIGTERM received");
  if (server) {
    server.httpServer.close();
  }
});
