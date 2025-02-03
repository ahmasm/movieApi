// src/application/services/movie.service.ts
import { Movie } from "../../core/domain/entities/movie.entity";
import { IMovieRepository } from "../../core/domain/interfaces/repositories/movie.repository.interface";
import { NotFoundError } from "../../core/domain/errors/not-found.error";
import { CreateMovieDto, UpdateMovieDto } from "../dtos/movie.dto";
import { CacheService } from "../../infrastructure/persistence/redis/cache.service";
import { IMovieService } from "src/core/domain/interfaces/services/movie.service.interface";

export class MovieService implements IMovieService {
  private readonly CACHE_KEY = "movies:list"; // More specific cache key
  private readonly CACHE_TTL = 3600; // 1 hour in seconds

  constructor(
    private readonly movieRepository: IMovieRepository,
    private readonly cacheService: CacheService,
  ) {}

  async createMovie(createMovieDto: CreateMovieDto): Promise<Movie> {
    const movie = new Movie(
      undefined,
      createMovieDto.title,
      createMovieDto.description,
      new Date(createMovieDto.releaseDate),
      createMovieDto.genre,
      createMovieDto.rating,
      createMovieDto.imdbId,
      createMovieDto.directorId,
    );

    const createdMovie = await this.movieRepository.create(movie);
    // Invalidate the cached list since we added a new movie
    await this.cacheService.del(this.CACHE_KEY);
    return createdMovie;
  }

  async getAllMovies(): Promise<Movie[]> {
    // Try to get movies from cache first
    const cachedMovies = await this.cacheService.get<Movie[]>(this.CACHE_KEY);

    if (cachedMovies) {
      console.log("Cache hit: Returning movies from cache");
      return cachedMovies;
    }

    // If not in cache, get from database
    console.log("Cache miss: Fetching movies from database");
    const movies = await this.movieRepository.findAll();

    // Store in cache for future requests
    await this.cacheService.set(this.CACHE_KEY, movies, this.CACHE_TTL);

    return movies;
  }

  async updateMovie(
    id: string,
    updateMovieDto: UpdateMovieDto,
  ): Promise<Movie> {
    const movie = await this.movieRepository.update(id, updateMovieDto);
    if (!movie) {
      throw new NotFoundError("Movie not found");
    }
    // Invalidate the cached list since we modified a movie
    await this.cacheService.del(this.CACHE_KEY);
    return movie;
  }

  async deleteMovie(id: string): Promise<void> {
    const deleted = await this.movieRepository.delete(id);
    if (!deleted) {
      throw new NotFoundError("Movie not found");
    }
    // Invalidate the cached list since we deleted a movie
    await this.cacheService.del(this.CACHE_KEY);
  }
}
