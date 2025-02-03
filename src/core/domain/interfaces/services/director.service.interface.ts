// src/core/domain/interfaces/services/director.service.interface.ts
import { Director } from "../../entities/director.entity";
import { CreateDirectorDto } from "../../../../application/dtos/director.dto";

export interface IDirectorService {
  createDirector(createDirectorDto: CreateDirectorDto): Promise<Director>;
  deleteDirector(id: string): Promise<void>;
}
