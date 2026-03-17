import { Router } from "express";
import { authRoute } from "../module/auth/auth.routes";

const router = Router();

router.use("/auth", authRoute);

export const indexRouter = router;
