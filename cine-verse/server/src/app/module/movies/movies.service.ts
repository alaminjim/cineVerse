import { uploadImage } from "../../config/cloudinary.config";
import { IRequestUser } from "../../interface/requestUser.interface";
import { prisma } from "../../lib/prisma";
import { ICreateMovie, IUpdateMovie } from "./movies.interface";

const createMovie = async (
  payload: ICreateMovie,
  user: IRequestUser,
  file?: Express.Multer.File,
) => {
  if (user.role !== "ADMIN") {
    throw new Error("Only Admin can create this movies");
  }

  let thumbnail: string | undefined;
  if (file) {
    thumbnail = await uploadImage(file);
  }

  const movie = await prisma.movie.create({
    data: {
      ...payload,
      thumbnail,
    },
    include: {
      _count: {
        select: { reviews: true },
      },
    },
  });

  return movie;
};

const updateMovie = async (
  movieId: string,
  payload: IUpdateMovie,
  user: IRequestUser,
  file?: Express.Multer.File,
) => {
  if (!(await prisma.movie.findFirst({ where: { id: movieId } }))) {
    throw new Error("Movie not found");
  }

  if (user.role !== "ADMIN") {
    throw new Error("Only Admin can update movies");
  }

  let thumbnail: string | undefined;

  if (file) {
    thumbnail = await uploadImage(file);
  }

  const data = thumbnail ? { ...payload, thumbnail } : payload;

  const movie = await prisma.movie.update({
    where: { id: movieId },
    data,
  });

  return movie;
};

const deleteMovie = async (movieId: string, user: IRequestUser) => {
  const isExists = await prisma.movie.findFirst({
    where: {
      id: movieId,
    },
  });

  if (!isExists) {
    throw new Error("This Movie Does not exists");
  }

  if (user.role !== "ADMIN") {
    throw new Error("Only Admin can delete this movies");
  }

  return await prisma.movie.delete({
    where: { id: movieId },
  });
};

export const adminMovieService = {
  createMovie,
  updateMovie,
  deleteMovie,
};
