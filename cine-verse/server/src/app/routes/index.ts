import { Router } from "express";
import { authRoute } from "../module/auth/auth.routes";
import { adminRoute } from "../module/admin/admin.routes";
import { movieRouter } from "../module/movies/movies.routes";

const router = Router();

router.use("/auth", authRoute);

router.use("/admin", adminRoute);

router.use("/movies", movieRouter);

export const indexRouter = router;
