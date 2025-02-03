// src/infrastructure/persistence/mongoose/repositories/director.repository.ts
import { Director } from "../../../../core/domain/entities/director.entity";
import { IDirectorRepository } from "../../../../core/domain/interfaces/repositories/director.repository.interface";
import { DirectorModel, MovieModel } from "../models";
import { Types } from "mongoose";
import { NotFoundError } from "../../../../core/domain/errors";
import { IDirectorBase } from "../types/director.types";

export class DirectorRepository implements IDirectorRepository {
  async create(director: Director): Promise<Director> {
    try {
      const newDirector = new DirectorModel({
        firstName: director.firstName,
        secondName: director.secondName,
        birthDate: director.birthDate,
        bio: director.bio,
      });

      const savedDirector = await newDirector.save();
      return this.mapToEntity(savedDirector);
    } catch (error) {
      console.error("Error in create director:", error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new NotFoundError(`Invalid director id format: ${id}`);
      }

      // Check if director has any movies
      const movieCount = await MovieModel.countDocuments({ directorId: id });
      if (movieCount > 0) {
        throw new Error(
          `Cannot delete director with ${movieCount} associated movies`,
        );
      }

      const result = await DirectorModel.findByIdAndDelete(id).exec();
      return !!result;
    } catch (error) {
      console.error(`Error in delete director: ${id}`, error);
      throw error;
    }
  }

  private mapToEntity(
    doc: IDirectorBase & { _id: Types.ObjectId | string },
  ): Director {
    return new Director(
      doc._id.toString(), // Ensure _id is converted to string
      doc.firstName,
      doc.secondName,
      doc.birthDate,
      doc.bio,
    );
  }
}
