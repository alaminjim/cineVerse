import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { envConfig } from "./app/config/env.js";
import { indexRouter } from "./app/routes/index.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth.js";
import notFound from "./app/middleware/notFound.js";
import path from "path";
import errorHandler from "./app/middleware/errorHandler.js";

import { Admin } from "./app/seed/seedingAdmin.js";

const app: Application = express();

// Ensure admin exists on startup
Admin();

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "src/app/template"));

app.use(
  cors({
    origin: (origin, callback) => {
      const allowed = [
        ...(envConfig.FRONTEND_URL ? envConfig.FRONTEND_URL.split(",") : []),
        envConfig.BETTER_AUTH_URL,
        "http://localhost:3000",
        "http://localhost:5000",
      ]
        .filter(Boolean)
        .map((url) => url.trim().replace(/\/$/, ""));

      // Allow if origin is in list, or if it's a Vercel/Netlify preview
      if (
        !origin ||
        allowed.includes(origin.replace(/\/$/, "")) ||
        origin.endsWith(".vercel.app") ||
        origin.endsWith(".netlify.app")
      ) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "cache",
      "Pragma",
      "x-requested-with",
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
