import { Request, Response } from "express";
import catchFunction from "../../shared/catchFunction";
import { movieService } from "./movies.service";
import { StatusCodes } from "http-status-codes";
import { IRequestUser } from "../../interface/requestUser.interface";

const createMovie = catchFunction(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await movieService.createMovie(req.body, user, req.file);
  res
    .status(StatusCodes.CREATED)
    .json({ success: true, message: "Movie Upload Successful", data: result });
});

const getAllMovies = catchFunction(async (req: Request, res: Response) => {
  const result = await movieService.getAllMovies(req.query);
  res.status(StatusCodes.OK).json({ success: true, data: result });
});

const getMovieById = catchFunction(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await movieService.getMovieById(id as string);
  res.status(StatusCodes.OK).json({ success: true, data: result });
});

const getNewReleases = catchFunction(async (req: Request, res: Response) => {
  const result = await movieService.getNewReleases();
  res.status(StatusCodes.OK).json({ success: true, data: result });
});

const getFeaturedMovies = catchFunction(async (req: Request, res: Response) => {
  const result = await movieService.getFeaturedMovies();
  res.status(StatusCodes.OK).json({ success: true, data: result });
});

const updateMovie = catchFunction(async (req: Request, res: Response) => {
  const user = req.user;
  const { id } = req.params;
  const result = await movieService.updateMovie(
    id as string,
    req.body,
    user,
    req.file,
  );
  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "Update Successful", data: result });
});

const updateMovieBuyPrice = catchFunction(
  async (req: Request, res: Response) => {
    const user = req.user as IRequestUser;

    if (user.role !== "ADMIN") {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: "Only Admin can update prices",
      });
    }

    const { id } = req.params;
    const { buyPrice } = req.body;

    if (!buyPrice || typeof buyPrice !== "number") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Valid buyPrice is required",
      });
    }

    if (buyPrice <= 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Price must be greater than 0",
      });
    }

    const result = await movieService.updateMovieBuyPrice(
      id as string,
      buyPrice,
    );

    res.status(StatusCodes.OK).json(result);
  },
);

const deleteMovie = catchFunction(async (req: Request, res: Response) => {
  const user = req.user;
  const { id } = req.params;
  await movieService.deleteMovie(id as string, user);
  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "Delete Successful" });
});

export const movieController = {
  createMovie,
  updateMovie,
  deleteMovie,
  getAllMovies,
  getMovieById,
  getNewReleases,
  getFeaturedMovies,
  updateMovieBuyPrice,
};
