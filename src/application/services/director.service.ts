// src/application/services/director.service.ts
import { NotFoundError } from "../../core/domain/errors/not-found.error";
import { Director } from "../../core/domain/entities/director.entity";
import { IDirectorRepository } from "../../core/domain/interfaces/repositories/director.repository.interface";
import { CreateDirectorDto } from "../dtos/director.dto";
import { IDirectorService } from "src/core/domain/interfaces/services/director.service.interface";

export class DirectorService implements IDirectorService {
  constructor(private readonly directorRepository: IDirectorRepository) {}

  async createDirector(
    createDirectorDto: CreateDirectorDto,
  ): Promise<Director> {
    const director = new Director(
      undefined,
      createDirectorDto.firstName,
      createDirectorDto.secondName,
      createDirectorDto.birthDate,
      createDirectorDto.bio,
    );

    return await this.directorRepository.create(director);
  }

  async deleteDirector(id: string): Promise<void> {
    const deleted = await this.directorRepository.delete(id);
    if (!deleted) {
      throw new NotFoundError("Director not found");
    }
  }
}
