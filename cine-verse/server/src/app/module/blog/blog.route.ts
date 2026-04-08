import { Router } from "express";
import { blogController } from "./blog.controller.js";

const router = Router();

router.get("/", blogController.getAllBlogs);
router.get("/:id", blogController.getBlogById);
router.post("/", blogController.createBlog);
router.patch("/:id", blogController.updateBlog);
router.delete("/:id", blogController.deleteBlog);

export const blogRoutes = router;
