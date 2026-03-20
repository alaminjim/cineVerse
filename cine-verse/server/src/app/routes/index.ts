import { Router } from "express";
import { authRoute } from "../module/auth/auth.routes";
import { adminRoute } from "../module/admin/admin.routes";
import { movieRouter } from "../module/movies/movies.routes";
import { reviewRoute } from "../module/review/review.routes";
import { commentRoute } from "../module/comments/comment.route";
import { likeRoute } from "../module/likes/likes.route";
import { watchListRoute } from "../module/watchList/watchList.route";
import { subscriptionRoute } from "../module/subscription/subcription.route";
import { purchaseRoute } from "../module/purchase/purchase.route";
import { adminAnalytics } from "../module/admin/analytics/analytics.routes";

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

export const indexRouter = router;
