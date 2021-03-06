// express
import express, { Application, RequestHandler } from "express";

// middleware
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import morgan from "morgan";

// typings
import Server from "./typings/Server";
import Controller from "./typings/Controller";

// utils
import { PORT } from "./config";
import db from "./models";
import passport from "passport";
import "./config/passport";

// controllers
import AuthCotnroller from "./controllers/AuthController";
import path from "path";

const app: Application = express();
const server: Server = new Server(app, db.sequelize, PORT);

const controllers: Array<Controller> = [new AuthCotnroller()];

const globalMiddleware: Array<RequestHandler> = [
  helmet(),
  bodyParser.urlencoded({ extended: false }),
  bodyParser.json(),
  cors({ credentials: true, origin: true }),
  passport.initialize(),
  morgan("dev"),
  express.static(path.join(__dirname, "../dist/public")),
];

Promise.resolve()
  .then(() => {
    server.initDatabase();
  })
  .then(() => {
    server.loadMiddleware(globalMiddleware);
    server.loadControllers(controllers);
    server.run();
    server.renderClient();
  });
