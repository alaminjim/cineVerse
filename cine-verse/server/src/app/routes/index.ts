import { Router } from "express";
import { authRoute } from "../module/auth/auth.routes.js";
import { adminRoute } from "../module/admin/admin.routes.js";
import { movieRouter } from "../module/movies/movies.routes.js";
import { reviewRoute } from "../module/review/review.routes.js";
import { commentRoute } from "../module/comments/comment.route.js";
import { likeRoute } from "../module/likes/likes.route.js";
import { watchListRoute } from "../module/watchList/watchList.route.js";
import { subscriptionRoute } from "../module/subscription/subcription.route.js";
import { purchaseRoute } from "../module/purchase/purchase.route.js";
import { adminAnalytics } from "../module/admin/analytics/analytics.routes.js";
import { userRoute } from "../module/user/user.routes.js";
import { aiRouter } from "../module/ai/ai.routes.js";
import { blogRoutes } from "../module/blog/blog.route.js";

const router = Router();

router.use("/auth", authRoute);

router.use("/admin", adminRoute);

router.use("/movies", movieRouter);

router.use("/reviews", reviewRoute);

router.use("/comments", commentRoute);

router.use("/likes", likeRoute);

router.use("/watchList", watchListRoute);

router.use("/subscription", subscriptionRoute);

router.use("/purchase", purchaseRoute);

router.use("/admin-analytics", adminAnalytics);

router.use("/user", userRoute);

router.use("/ai", aiRouter);

router.use("/blog", blogRoutes);

export const indexRouter = router;
