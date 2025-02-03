// src/presentation/controllers/movie.controller.ts
import { Request, Response, NextFunction } from "express";
import { MovieService } from "../../application/services/movie.service";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import {
  CreateMovieDto,
  UpdateMovieDto,
} from "../../application/dtos/movie.dto";

export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  createMovie = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const movieDto = plainToClass(CreateMovieDto, req.body, {
        enableImplicitConversion: true,
      });

      const errors = await validate(movieDto);
      if (errors.length > 0) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.map((error) => ({
            property: error.property,
            constraints: error.constraints,
          })),
        });
      }

      const movie = await this.movieService.createMovie(movieDto);
      return res.status(201).json(movie);
    } catch (error) {
      return next(error);
    }
  };

  getAllMovies = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const movies = await this.movieService.getAllMovies();
      return res.json(movies);
    } catch (error) {
      return next(error);
    }
  };

  updateMovie = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const movieDto = plainToClass(UpdateMovieDto, req.body, {
        enableImplicitConversion: true,
      });

      const errors = await validate(movieDto, { skipMissingProperties: true });
      if (errors.length > 0) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.map((error) => ({
            property: error.property,
            constraints: error.constraints,
          })),
        });
      }

      const movie = await this.movieService.updateMovie(
        req.params.id,
        movieDto,
      );
      return res.json(movie);
    } catch (error) {
      return next(error);
    }
  };

  deleteMovie = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      await this.movieService.deleteMovie(req.params.id);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  };
}
