import { Router } from "express";
import { authRoute } from "../module/auth/auth.routes";
import { adminRoute } from "../module/admin/admin.routes";
import { movieRouter } from "../module/movies/movies.routes";
import { reviewRoute } from "../module/review/review.routes";
import { commentRoute } from "../module/comments/comment.route";

const router = Router();

router.use("/auth", authRoute);

router.use("/admin", adminRoute);

router.use("/movies", movieRouter);

router.use("/reviews", reviewRoute);

router.use("/comments", commentRoute);

export const indexRouter = router;
