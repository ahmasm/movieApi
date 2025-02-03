// src/core/domain/interfaces/repositories/movie.repository.interface.ts
import { Movie } from "../../entities/movie.entity";

export interface IMovieRepository {
  create(movie: Movie): Promise<Movie>;
  findAll(): Promise<Movie[]>;
  findById(id: string): Promise<Movie | null>;
  update(id: string, movie: Partial<Movie>): Promise<Movie | null>;
  delete(id: string): Promise<boolean>;
}
