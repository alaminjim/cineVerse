import { Request, Response } from "express";
import catchFunction from "../../shared/catchFunction";
import { movieService } from "./movies.service";
import { StatusCodes } from "http-status-codes";

const createMovie = catchFunction(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await movieService.createMovie(req.body, user, req.file);
  res
    .status(StatusCodes.CREATED)
    .json({ success: true, message: "Movie Upload Successful", data: result });
});

const getAllMovies = catchFunction(async (req: Request, res: Response) => {
  const result = await movieService.getAllMovies();
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
};
