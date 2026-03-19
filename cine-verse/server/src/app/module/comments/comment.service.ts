import { prisma } from "../../lib/prisma";
import { ICreateComment, IUpdateComment } from "./comment.interface";

const createComment = async (payload: ICreateComment, userId: string) => {
  const comment = await prisma.comment.create({
    data: {
      reviewId: payload.reviewId,
      userId,
      content: payload.content,
      parentCommentId: payload.parentCommentId,
    },
    include: {
      user: {
        select: { id: true, name: true },
      },
    },
  });

  await prisma.review.update({
    where: { id: payload.reviewId },
    data: { commentCount: { increment: 1 } },
  });

  return comment;
};

const getCommentsByReview = async (reviewId: string) => {
  const comments = await prisma.comment.findMany({
    where: {
      reviewId,
      parentCommentId: null,
    },
    include: {
      user: {
        select: { id: true, name: true },
      },
      replies: {
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return comments;
};

const getAllComments = async () => {
  const comments = await prisma.comment.findMany({
    include: {
      user: {
        select: { id: true, name: true },
      },
      replies: {
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return comments;
};

const getCommentById = async (commentId: string) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: {
      user: {
        select: { id: true, name: true },
      },
      replies: {
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
      },
    },
  });

  if (!comment) {
    throw new Error("Comment not found");
  }

  return comment;
};

const updateComment = async (
  commentId: string,
  payload: IUpdateComment,
  userId: string,
) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    throw new Error("Comment not found");
  }

  if (comment.userId !== userId) {
    throw new Error("Only comment owner can edit");
  }

  const updated = await prisma.comment.update({
    where: { id: commentId },
    data: {
      content: payload.content,
    },
    include: {
      user: {
        select: { id: true, name: true },
      },
    },
  });

  return updated;
};

const deleteComment = async (commentId: string, userId: string) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    throw new Error("Comment not found");
  }

  if (comment.userId !== userId) {
    throw new Error("Only comment owner can delete");
  }

  const replyCount = await prisma.comment.count({
    where: { parentCommentId: commentId },
  });

  await prisma.comment.deleteMany({
    where: {
      OR: [{ id: commentId }, { parentCommentId: commentId }],
    },
  });

  await prisma.review.update({
    where: { id: comment.reviewId },
    data: { commentCount: { decrement: 1 + replyCount } },
  });

  return { success: true };
};

export const commentService = {
  createComment,
  getCommentsByReview,
  getCommentById,
  getAllComments,
  updateComment,
  deleteComment,
};
