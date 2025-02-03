// src/infrastructure/persistence/mongoose/models/index.ts
import mongoose from "mongoose";
import { IMovieDocument } from "../types/movie.types";
import { IDirectorDocument } from "../types/director.types";
import { MovieSchemaDefinition } from "../schemas/movie.schema";
import { DirectorSchemaDefinition } from "../schemas/director.schema";

// Export models
export const MovieModel =
  mongoose.models.Movie ||
  mongoose.model<IMovieDocument>("Movie", MovieSchemaDefinition);
export const DirectorModel =
  mongoose.models.Director ||
  mongoose.model<IDirectorDocument>("Director", DirectorSchemaDefinition);
