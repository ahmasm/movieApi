import { Document, Types } from "mongoose";

export interface IMovieBase {
  title: string;
  description: string;
  releaseDate: Date;
  genre: string;
  rating: number;
  imdbId: string;
  duration?: number;
  language?: string[];
  tags?: string[];
  cast?: string[];
}

export interface IMovieDocument extends IMovieBase, Document {
  directorId: Types.ObjectId;
}

export interface IMovieLean extends IMovieBase {
  _id: string;
  directorId: string | IDirectorPopulated;
}

export interface IDirectorPopulated {
  _id: Types.ObjectId;
  firstName: string;
  secondName: string;
  birthDate: Date;
  bio: string;
}

export function isPopulatedDirector(
  director: string | IDirectorPopulated,
): director is IDirectorPopulated {
  return (
    typeof director === "object" &&
    director !== null &&
    "_id" in director &&
    typeof director._id === "string"
  );
}
