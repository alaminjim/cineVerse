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

  // Cache public movie lists for 60 seconds, with background revalidation for up to 120 seconds
  res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=120");
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

  // Cache specific movie details for 120 seconds, with background revalidation for up to 300 seconds
  res.setHeader("Cache-Control", "public, max-age=120, stale-while-revalidate=300");
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

  // Cache featured movies for 5 minutes, with background revalidation for up to 10 minutes
  res.setHeader("Cache-Control", "public, max-age=300, stale-while-revalidate=600");
  res.status(StatusCodes.OK).json(result);
});

const getNewReleases = catchFunction(async (req: Request, res: Response) => {
  const result = await movieService.getNewReleases();

  // Cache new releases for 5 minutes, with background revalidation for up to 10 minutes
  res.setHeader("Cache-Control", "public, max-age=300, stale-while-revalidate=600");
  res.status(StatusCodes.OK).json(result);
});

const getComingSoon = catchFunction(async (req: Request, res: Response) => {
  const result = await movieService.getComingSoon();

  // Cache coming soon movies for 10 minutes, with background revalidation for up to 20 minutes
  res.setHeader("Cache-Control", "public, max-age=600, stale-while-revalidate=1200");
  res.status(StatusCodes.OK).json(result);
});

const getEditorsPicks = catchFunction(async (req: Request, res: Response) => {
  const result = await movieService.getEditorsPicks();

  // Cache editors' picks for 5 minutes, with background revalidation for up to 10 minutes
  res.setHeader("Cache-Control", "public, max-age=300, stale-while-revalidate=600");
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
