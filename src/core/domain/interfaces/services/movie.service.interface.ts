// src/core/domain/interfaces/services/movie.service.interface.ts
import { Movie } from "../../entities/movie.entity";
import {
  CreateMovieDto,
  UpdateMovieDto,
} from "../../../../application/dtos/movie.dto";

export interface IMovieService {
  createMovie(createMovieDto: CreateMovieDto): Promise<Movie>;
  getAllMovies(): Promise<Movie[]>;
  updateMovie(id: string, updateMovieDto: UpdateMovieDto): Promise<Movie>;
  deleteMovie(id: string): Promise<void>;
}
