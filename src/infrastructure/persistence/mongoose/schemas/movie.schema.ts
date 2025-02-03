// src/infrastructure/persistence/mongoose/schemas/movie.schema.ts

import mongoose from "mongoose";

const MovieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    genre: {
      type: String,
      required: true,
      enum: [
        "Action",
        "Adventure",
        "Animation",
        "Comedy",
        "Crime",
        "Documentary",
        "Drama",
        "Family",
        "Fantasy",
        "Horror",
        "Mystery",
        "Romance",
        "Sci-Fi",
        "Thriller",
        "War",
        "Western",
      ],
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    imdbId: {
      type: String,
      required: true,
      unique: true,
    },
    directorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Director",
      required: true,
    },
    duration: Number,
    language: [String],
    tags: [String],
    cast: [String],
  },
  {
    timestamps: true,
    collection: "movies",
  },
);

export const MovieSchemaDefinition = MovieSchema;
