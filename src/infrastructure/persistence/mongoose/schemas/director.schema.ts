// src/infrastructure/persistence/mongoose/schemas/director.schema.ts
import mongoose from "mongoose";

// Director Schema
const DirectorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    secondName: {
      type: String,
      required: true,
      trim: true,
    },
    birthDate: {
      type: Date,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    nationality: String,
    awards: [
      {
        name: String,
        year: Number,
      },
    ],
    knownFor: [String],
  },
  {
    timestamps: true,
    collection: "directors",
  },
);

export const DirectorSchemaDefinition = DirectorSchema;
