// src/app.ts
import express from "express";
import { createMovieRouter } from "./presentation/routes/movie.routes";
import { errorMiddleware } from "./presentation/middlewares/error.middleware";
import { setupSwagger } from "./infrastructure/config/swagger.config";
import { MovieController } from "./presentation/controllers/movie.controller";
import { MovieService } from "./application/services/movie.service";
import { MovieRepository } from "./infrastructure/persistence/mongoose/repositories/movie.repository";
import { CacheService } from "./infrastructure/persistence/redis/cache.service";
import { DirectorService } from "./application/services/director.service";
import { DirectorRepository } from "./infrastructure/persistence/mongoose/repositories/director.repository";
import { DirectorController } from "./presentation/controllers/director.controller";
import { createDirectorRouter } from "./presentation/routes/director.routes";

const app = express();

// Middleware
app.use(express.json());

// Dependencies
const cacheService = new CacheService();

// Repositories
const movieRepository = new MovieRepository();
const directorRepository = new DirectorRepository();

// Services
const movieService = new MovieService(movieRepository, cacheService);
const directorService = new DirectorService(directorRepository);

// Controllers
const movieController = new MovieController(movieService);
const directorController = new DirectorController(directorService);

// Routes
app.use("/api/movies", createMovieRouter(movieController, cacheService));
app.use("/api/directors", createDirectorRouter(directorController));

// Swagger
setupSwagger(app);

// Error handling - must be last
app.use(errorMiddleware);

export default app;
