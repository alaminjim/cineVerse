import { Request, Response } from "express";
import { commentService } from "./comment.service";
import catchFunction from "../../shared/catchFunction";

const createComment = catchFunction(async (req: Request, res: Response) => {
  const result = await commentService.createComment(req.body, req.user.userId);

  res.status(201).json({
    success: true,
    message: "Comment created",
    data: result,
  });
});

const getCommentsByReview = catchFunction(
  async (req: Request, res: Response) => {
    const { reviewId } = req.params;
    const result = await commentService.getCommentsByReview(reviewId as string);
    res.json(result);
  },
);

const getCommentById = catchFunction(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await commentService.getCommentById(id as string);
  res.json(result);
});

const updateComment = catchFunction(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await commentService.updateComment(
    id as string,
    req.body,
    req.user.userId,
  );

  res.json({
    success: true,
    message: "Comment updated",
    data: result,
  });
});

const deleteComment = catchFunction(async (req: Request, res: Response) => {
  const { id } = req.params;
  await commentService.deleteComment(id as string, req.user.userId);

  res.json({
    success: true,
    message: "Comment deleted",
  });
});

export const commentController = {
  createComment,
  getCommentsByReview,
  getCommentById,
  updateComment,
  deleteComment,
};
