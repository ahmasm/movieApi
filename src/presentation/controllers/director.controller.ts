// src/presentation/controllers/director.controller.ts
import { Request, Response, NextFunction } from "express";
import { DirectorService } from "../../application/services/director.service";
import { CreateDirectorDto } from "../../application/dtos/director.dto";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";

export class DirectorController {
  constructor(private readonly directorService: DirectorService) {}

  createDirector = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const directorDto = plainToClass(CreateDirectorDto, req.body);
      const errors = await validate(directorDto);

      if (errors.length > 0) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.map((error) => ({
            property: error.property,
            constraints: error.constraints,
          })),
        });
      }

      const director = await this.directorService.createDirector(directorDto);
      return res.status(201).json(director);
    } catch (error) {
      return next(error);
    }
  };

  deleteDirector = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      await this.directorService.deleteDirector(req.params.id);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  };
}
