// src/infrastructure/persistence/mongoose/repositories/movie.repository.ts
import { Movie } from "../../../../core/domain/entities/movie.entity";
import { IMovieRepository } from "../../../../core/domain/interfaces/repositories/movie.repository.interface";
import { IMovieLean } from "../types/movie.types";
import { NotFoundError } from "../../../../core/domain/errors/not-found.error";
import { Types } from "mongoose";
import { DirectorModel, MovieModel } from "../models";

export class MovieRepository implements IMovieRepository {
  async findAll(): Promise<Movie[]> {
    try {
      const movies = await MovieModel.find()
        .populate("directorId")
        .lean<IMovieLean[]>()
        .exec();

      return movies.map((movie) => this.mapToEntity(movie));
    } catch (error) {
      console.error("Error in findAll:", error);
      throw error;
    }
  }

  async create(movie: Movie): Promise<Movie> {
    try {
      // Verify director exists
      const directorExists = await DirectorModel.findById(movie.directorId);
      if (!directorExists) {
        throw new NotFoundError(
          `Director with id ${movie.directorId} not found`,
        );
      }

      const newMovie = new MovieModel({
        title: movie.title,
        description: movie.description,
        releaseDate: movie.releaseDate,
        genre: movie.genre,
        rating: movie.rating,
        imdbId: movie.imdbId,
        directorId: new Types.ObjectId(movie.directorId),
        duration: movie.duration,
        language: movie.language,
        tags: movie.tags,
        cast: movie.cast,
      });

      console.log("Creating new movie:", newMovie);

      const savedMovie = await newMovie.save();
      console.log("Saved movie:", savedMovie);

      const populatedMovie = await MovieModel.findById(savedMovie._id)
        .populate({
          path: "directorId",
          model: DirectorModel,
          select: "_id firstName secondName birthDate bio",
        })
        .lean<IMovieLean>() // Specify the type here
        .exec();

      console.log("Populated movie:", JSON.stringify(populatedMovie, null, 2));

      if (!populatedMovie) {
        throw new Error("Failed to retrieve saved movie");
      }

      const mappedMovie = this.mapToEntity(populatedMovie);
      console.log("Mapped movie:", mappedMovie);

      return mappedMovie;
    } catch (error) {
      console.error("Error in create:", error);
      throw error;
    }
  }

  async findById(id: string): Promise<Movie | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new NotFoundError(`Invalid id format: ${id}`);
      }

      const movie = await MovieModel.findById(id)
        .populate("directorId")
        .lean<IMovieLean>()
        .exec();

      return movie ? this.mapToEntity(movie) : null;
    } catch (error) {
      console.error(`Error in findById: ${id}`, error);
      throw error;
    }
  }

  async update(id: string, movieData: Partial<Movie>): Promise<Movie | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new NotFoundError(`Invalid id format: ${id}`);
      }

      const updatedMovie = await MovieModel.findByIdAndUpdate(
        id,
        {
          $set: {
            ...movieData,
            directorId: movieData.directorId
              ? new Types.ObjectId(movieData.directorId)
              : undefined,
          },
        },
        { new: true, runValidators: true },
      )
        .populate("directorId")
        .lean<IMovieLean>()
        .exec();

      if (!updatedMovie) {
        throw new NotFoundError(`Movie with id ${id} not found`);
      }

      return this.mapToEntity(updatedMovie);
    } catch (error) {
      console.error(`Error in update: ${id}`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new NotFoundError(`Invalid id format: ${id}`);
      }

      const result = await MovieModel.findByIdAndDelete(id).exec();
      return !!result;
    } catch (error) {
      console.error(`Error in delete: ${id}`, error);
      throw error;
    }
  }

  private mapToEntity(movie: IMovieLean): Movie {
    console.log(
      "Mapping movie to entity, raw data:",
      JSON.stringify(movie, null, 2),
    );

    if (!movie) {
      throw new Error("No movie data to map");
    }

    // Handle director ID in a more robust way
    let directorId: string;
    if (movie.directorId) {
      if (typeof movie.directorId === "string") {
        directorId = movie.directorId;
      } else if (movie.directorId instanceof Types.ObjectId) {
        directorId = movie.directorId.toString();
      } else if (typeof movie.directorId === "object" && movie.directorId._id) {
        directorId = movie.directorId._id.toString();
      } else {
        console.error("Unexpected directorId format:", movie.directorId);
        throw new Error("Invalid director ID format");
      }
    } else {
      console.error("Missing directorId in movie data:", movie);
      throw new Error("Director ID is missing");
    }

    return new Movie(
      movie._id.toString(),
      movie.title,
      movie.description,
      movie.releaseDate,
      movie.genre,
      movie.rating,
      movie.imdbId,
      directorId,
      movie.duration,
      movie.language,
      movie.tags,
      movie.cast,
    );
  }
}
