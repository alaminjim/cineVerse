import { Request, Response } from "express";
import catchFunction from "../../shared/catchFunction";
import { movieService } from "./movies.service";

const createMovie = catchFunction(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await movieService.createMovie(req.body, user, req.file);
  res.status(201).json(result);
});

const getAllMovies = catchFunction(async (req: Request, res: Response) => {
  const result = await movieService.getAllMovies();
  res.json(result);
});

const getMovieById = catchFunction(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await movieService.getMovieById(id as string);
  res.json(result);
});

const getNewReleases = catchFunction(async (req: Request, res: Response) => {
  const result = await movieService.getNewReleases();
  res.json(result);
});

const getFeaturedMovies = catchFunction(async (req: Request, res: Response) => {
  const result = await movieService.getFeaturedMovies();
  res.json(result);
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
  res.json(result);
});

const deleteMovie = catchFunction(async (req: Request, res: Response) => {
  const user = req.user;
  const { id } = req.params;
  const result = await movieService.deleteMovie(id as string, user);
  res.json(result);
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
