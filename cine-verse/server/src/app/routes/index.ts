import { Router } from "express";
import { authRoute } from "../module/auth/auth.routes";
import { adminRoute } from "../module/admin/admin.routes";

const router = Router();

router.use("/auth", authRoute);

router.use("/admin", adminRoute);

export const indexRouter = router;
