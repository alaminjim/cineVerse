import { prisma } from "../../lib/prisma.js";

const db = prisma as any;

const getAllBlogs = async () => {
  return await db.blog.findMany({
    orderBy: {
      publishDate: "desc",
    },
  });
};

const getBlogById = async (id: string) => {
  return await db.blog.findUnique({
    where: { id },
  });
};

const createBlog = async (data: any) => {
  return await db.blog.create({
    data,
  });
};

const updateBlog = async (id: string, data: any) => {
  return await db.blog.update({
    where: { id },
    data,
  });
};

const deleteBlog = async (id: string) => {
  return await db.blog.delete({
    where: { id },
  });
};

export const blogService = {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};
