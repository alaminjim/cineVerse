import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchFunction from "../../shared/catchFunction.js";
import { movieService } from "./movies.service.js";

const createMovie = catchFunction(async (req, res) => {
  const result = await movieService.createMovie(req.body, req.file);

  res.status(StatusCodes.CREATED).json({
    success: true,
    data: result,
  });
});

const getAllMovies = catchFunction(async (req: Request, res: Response) => {
  const result = await movieService.getAllMovies(req.query);

  res.status(StatusCodes.OK).json(result);
});

const getMovieById = catchFunction(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await movieService.getMovieById(id as string);

  if (!result) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: "Movie not found",
    });
  }

  res.status(StatusCodes.OK).json(result);
});

const updateMovie = catchFunction(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await movieService.updateMovie(id as string, req.body, req.file);

  if (!result) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: "Movie not found",
    });
  }

  res.status(StatusCodes.OK).json(result);
});

const getFeaturedMovies = catchFunction(async (req: Request, res: Response) => {
  const result = await movieService.getFeaturedMovies();

  res.status(StatusCodes.OK).json(result);
});

const getNewReleases = catchFunction(async (req: Request, res: Response) => {
  const result = await movieService.getNewReleases();

  res.status(StatusCodes.OK).json(result);
});

const getComingSoon = catchFunction(async (req: Request, res: Response) => {
  const result = await movieService.getComingSoon();

  res.status(StatusCodes.OK).json(result);
});

const getEditorsPicks = catchFunction(async (req: Request, res: Response) => {
  const result = await movieService.getEditorsPicks();

  res.status(StatusCodes.OK).json(result);
});

const deleteMovie = catchFunction(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Movie ID is required",
    });
  }

  const result = await movieService.deleteMovie(id as string);

  if (!result) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: "Movie not found",
    });
  }

  res.status(StatusCodes.OK).json(result);
});

export const movieController = {
  createMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
  getFeaturedMovies,
  getNewReleases,
  getComingSoon,
  getEditorsPicks,
  deleteMovie,
};
