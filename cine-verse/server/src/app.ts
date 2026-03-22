import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { envConfig } from "./app/config/env";
import { indexRouter } from "./app/routes";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import notFound from "./app/middleware/notFound";
import path from "path";
import errorHandler from "./app/middleware/errorHandler";

const app: Application = express();

app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), "src/app/template"));

app.use(
  cors({
    origin: [
      envConfig.FRONTEND_URL as string,
      envConfig.BETTER_AUTH_URL as string,
      "http://localhost:3000",
      "http://localhost:5000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "cache",
      "Pragma",
    ],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", toNodeHandler(auth));

app.use("/api/v1", indexRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("api is working....!");
});

app.use(notFound);

app.use(errorHandler);

export default app;
