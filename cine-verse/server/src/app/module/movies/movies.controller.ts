import { Request, Response } from "express";
import catchFunction from "../../shared/catchFunction";
import { adminMovieService } from "./movies.service";

const createMovie = catchFunction(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await adminMovieService.createMovie(req.body, user, req.file);
  res.status(201).json(result);
});

const updateMovie = catchFunction(async (req: Request, res: Response) => {
  const user = req.user;
  const { id } = req.params;
  const result = await adminMovieService.updateMovie(
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
  const result = await adminMovieService.deleteMovie(id as string, user);
  res.json(result);
});

export const adminMovieController = {
  createMovie,
  updateMovie,
  deleteMovie,
};
