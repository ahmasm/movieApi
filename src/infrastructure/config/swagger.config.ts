// src/infrastructure/config/swagger.config.ts
import swaggerJsdoc from "swagger-jsdoc";
import { Express } from "express";
import swaggerUi from "swagger-ui-express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Movie API",
      version: "1.0.0",
      description: "Movie Management API Documentation",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      schemas: {
        Movie: {
          type: "object",
          required: [
            "title",
            "description",
            "releaseDate",
            "genre",
            "rating",
            "imdbId",
            "directorId",
          ],
          properties: {
            title: {
              type: "string",
              example: "Inception",
            },
            description: {
              type: "string",
              example:
                "A thief who steals corporate secrets through dream-sharing technology.",
            },
            releaseDate: {
              type: "string",
              format: "date",
              example: "2010-07-16",
            },
            genre: {
              type: "string",
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
              example: "Sci-Fi",
            },
            rating: {
              type: "number",
              minimum: 0,
              maximum: 10,
              example: 8.8,
            },
            imdbId: {
              type: "string",
              pattern: "^tt\\d{7,8}$",
              example: "tt1375666",
            },
            directorId: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            duration: {
              type: "number",
              example: 148,
            },
            language: {
              type: "array",
              items: {
                type: "string",
              },
              example: ["English", "Japanese"],
            },
            tags: {
              type: "array",
              items: {
                type: "string",
              },
              example: ["dream", "heist", "mind-bending"],
            },
            cast: {
              type: "array",
              items: {
                type: "string",
              },
              example: ["Leonardo DiCaprio", "Joseph Gordon-Levitt"],
            },
          },
        },
      },
    },
  },
  apis: ["./src/presentation/routes/*.ts"],
};

export const setupSwagger = (app: Express) => {
  const specs = swaggerJsdoc(options);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};
