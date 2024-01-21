import https from "https";
import http from "http";
import fs from "fs";
import express from "express";
import "express-async-errors";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import bodyParser from "body-parser";
import path from "path";
import authRouter from "./router/authRouter.js";
import { config } from "./config.js";
import memberRouter from "./router/memberRouter.js";
import rankRouter from "./router/rankRouter.js";

const app = express();

const pathDir = path.resolve("./view");
app.use("/", express.static(pathDir));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());
app.use(cors());
app.use(
  morgan(
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent'
  )
);

app.use("/auth", authRouter);
app.use("/member", memberRouter);
app.use("/rank", rankRouter);

app.use((req, res, next) => {
  res.sendStatus(404);
});

app.use((error, req, res, next) => {
  console.error(error);
  res.sendStatus(500);
});

try {
  const options = {
    ca: fs.readFileSync(config.ssl.path + config.ssl.ca),
    key: fs.readFileSync(config.ssl.path + config.ssl.key),
    cert: fs.readFileSync(config.ssl.path + config.ssl.cert),
    minVersion: "TLSv1.3",
  };

  const envHttp = config.protocol === "http" ? http : https;

  envHttp
    .createServer(options, app, (req, res) => {
      console.log(
        `[${config.protocol}] ${config.nodeEnv} - Connceting ...........`
      );
    })
    .listen(config.port, () => {
      console.log(`[${config.protocol}] ${config.nodeEnv} - Server is started`);
    });
} catch (error) {
  console.log(
    `[${config.protocol}] ${config.nodeEnv} - Server is not Active. Please Check Your Server`
  );
  console.log(error);
}
