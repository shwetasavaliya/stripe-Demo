import "reflect-metadata";
import express from "express";
import bodyParser, { json } from "body-parser";
import { responseEnhancer } from "./middleware/response";
import cors from "cors";
import initRoute from "./routes";
import connectMongoDB from "./utils/db/mongo.db";
import { useContainer } from "typeorm";
import { Container } from "typeorm-typedi-extensions";
import swaggerRoutes from "./swagger/swagger-handler";
import path from "path";

class Server {
  public app: express.Application = express();

  constructor() {
    this.app.use(
      "/api/v1/webhook/create-account1",
      bodyParser.raw({ type: "*/*" })
    );
    this.app.use(
      "/api/v1/chargeWebhook/create-charge",
      bodyParser.raw({ type: "*/*" })
    );
    this.app.use(
      "/api/v1/transferWebhook/create-transfer",
      bodyParser.raw({ type: "*/*" })
    );
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(responseEnhancer());
    this.app.use(express.json());
    this.app.use(
      cors({
        origin: "*",
      })
    );
    this.app.use("/api-docs", swaggerRoutes);
    initRoute(this.app);
    useContainer(Container);
    connectMongoDB();
  }
}

export default new Server().app;
