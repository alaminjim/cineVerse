import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { envConfig } from "./app/config/env";
import { indexRouter } from "./app/routes";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import notFound from "./app/middleware/notFound";
import path from "path";
const app = express();
app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), "src/app/template"));
app.use(cors({
    origin: [
        envConfig.FRONTEND_URL,
        envConfig.BETTER_AUTH_URL,
        "http://localhost:3000",
        "http://localhost:5000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth", toNodeHandler(auth));
app.use("/api/v1", indexRouter);
app.get("/", (req, res) => {
    res.send("api is working....!");
});
app.use(notFound);
export default app;
