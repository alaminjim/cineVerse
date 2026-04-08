import { Request, Response } from "express";
import { blogService } from "./blog.service.js";

const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const result = await blogService.getAllBlogs();
    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBlogById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await blogService.getBlogById(id as string);
    if (!result) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createBlog = async (req: Request, res: Response) => {
  try {
    const result = await blogService.createBlog(req.body);
    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await blogService.updateBlog(id as string, req.body);
    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await blogService.deleteBlog(id as string);
    res.json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const blogController = {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};
