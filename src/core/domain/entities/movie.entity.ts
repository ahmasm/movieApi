// src/core/domain/entities/movie.entity.ts
export class Movie {
  constructor(
    public readonly id: string | undefined,
    public readonly title: string,
    public readonly description: string,
    public readonly releaseDate: Date,
    public readonly genre: string,
    public readonly rating: number,
    public readonly imdbId: string,
    public readonly directorId: string,
    public readonly duration?: number,
    public readonly language?: string[],
    public readonly tags?: string[],
    public readonly cast?: string[],
  ) {
    this.validateRating(rating);
  }

  private validateRating(rating: number): void {
    if (rating < 0 || rating > 10) {
      throw new Error("Rating must be between 0 and 10");
    }
  }
}
