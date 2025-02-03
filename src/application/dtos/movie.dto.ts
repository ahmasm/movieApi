// src/application/dtos/movie.dto.ts
import {
  IsString,
  IsNumber,
  IsDate,
  Min,
  Max,
  IsArray,
  IsMongoId,
  IsOptional,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateMovieDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @Type(() => Date)
  @IsDate()
  releaseDate!: Date;

  @IsString()
  genre!: string;

  @IsNumber()
  @Min(0)
  @Max(10)
  rating!: number;

  @IsString()
  imdbId!: string;

  @IsMongoId()
  directorId!: string;

  @IsNumber()
  @IsOptional()
  duration?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  language?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  cast?: string[];
}

export class UpdateMovieDto implements Partial<CreateMovieDto> {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  releaseDate?: Date;

  @IsString()
  @IsOptional()
  genre?: string;

  @IsNumber()
  @Min(0)
  @Max(10)
  @IsOptional()
  rating?: number;

  @IsString()
  @IsOptional()
  imdbId?: string;

  @IsMongoId()
  @IsOptional()
  directorId?: string;

  @IsNumber()
  @IsOptional()
  duration?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  language?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  cast?: string[];
}
