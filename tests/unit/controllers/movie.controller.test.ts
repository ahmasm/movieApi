// tests/unit/controllers/movie.controller.test.ts
import { Request, Response, NextFunction } from "express";
import { MovieController } from "../../../src/presentation/controllers/movie.controller";
import { MovieService } from "../../../src/application/services/movie.service";
import {
  CreateMovieDto,
  UpdateMovieDto,
} from "../../../src/application/dtos/movie.dto";
import { Movie } from "../../../src/core/domain/entities/movie.entity";
import { NotFoundError } from "../../../src/core/domain/errors/not-found.error";
import { CacheService } from "../../../src/infrastructure/persistence/redis/cache.service";
import { IMovieRepository } from "../../../src/core/domain/interfaces/repositories/movie.repository.interface";

describe("MovieController", () => {
  let movieController: MovieController;
  let movieService: jest.Mocked<MovieService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    const movieRepositoryStub: Partial<IMovieRepository> = {
      create: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const cacheServiceStub: Partial<CacheService> = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };
    movieService = {
      // Provide dummy values for required properties.
      CACHE_KEY: "movies:list",
      CACHE_TTL: 3600,
      movieRepository: movieRepositoryStub,
      cacheService: cacheServiceStub,
      // Mock the methods that the controller uses.
      createMovie: jest.fn(),
      getAllMovies: jest.fn(),
      updateMovie: jest.fn(),
      deleteMovie: jest.fn(),
    } as unknown as jest.Mocked<MovieService>;

    movieController = new MovieController(movieService);

    mockRequest = {
      body: {},
      params: {},
    };

    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    nextFunction = jest.fn();
  });

  describe("createMovie", () => {
    const mockMovieDto: CreateMovieDto = {
      title: "Test Movie",
      description: "Test Description",
      releaseDate: new Date("2024-01-01"),
      genre: "Action",
      rating: 8.5,
      imdbId: "tt1234567",
      directorId: "507f1f77bcf86cd799439011",
    };

    const mockMovie = {
      id: "507f1f77bcf86cd799439012",
      ...mockMovieDto,
    };

    it("should create a movie successfully", async () => {
      mockRequest.body = mockMovieDto;
      movieService.createMovie.mockResolvedValue(mockMovie as Movie);

      await movieController.createMovie(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(movieService.createMovie).toHaveBeenCalledWith(mockMovieDto);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockMovie);
    });

    it("should handle validation errors", async () => {
      mockRequest.body = { ...mockMovieDto, rating: 12 }; // Invalid rating

      await movieController.createMovie(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Validation failed",
        }),
      );
    });
  });

  describe("getAllMovies", () => {
    it("should return all movies", async () => {
      const mockMovies = [
        { id: "1", title: "Movie 1" },
        { id: "2", title: "Movie 2" },
      ];

      movieService.getAllMovies.mockResolvedValue(mockMovies as Movie[]);

      await movieController.getAllMovies(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(movieService.getAllMovies).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockMovies);
    });

    it("should handle errors through next function", async () => {
      const error = new Error("Database error");
      movieService.getAllMovies.mockRejectedValue(error);

      await movieController.getAllMovies(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(nextFunction).toHaveBeenCalledWith(error);
    });
  });

  describe("updateMovie", () => {
    const mockUpdateDto: UpdateMovieDto = {
      title: "Updated Movie",
      rating: 9.0,
    };

    it("should update a movie successfully", async () => {
      mockRequest.params = { id: "1" };
      mockRequest.body = mockUpdateDto;
      const updatedMovie = { id: "1", ...mockUpdateDto };

      movieService.updateMovie.mockResolvedValue(updatedMovie as Movie);

      await movieController.updateMovie(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(movieService.updateMovie).toHaveBeenCalledWith("1", mockUpdateDto);
      expect(mockResponse.json).toHaveBeenCalledWith(updatedMovie);
    });

    it("should handle not found error", async () => {
      mockRequest.params = { id: "999" };
      mockRequest.body = mockUpdateDto;

      movieService.updateMovie.mockRejectedValue(
        new NotFoundError("Movie not found"),
      );

      await movieController.updateMovie(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(nextFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Movie not found",
        }),
      );
    });
  });

  describe("deleteMovie", () => {
    it("should delete a movie successfully", async () => {
      mockRequest.params = { id: "1" };
      movieService.deleteMovie.mockResolvedValue(undefined);

      await movieController.deleteMovie(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(movieService.deleteMovie).toHaveBeenCalledWith("1");
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });
  });
});
