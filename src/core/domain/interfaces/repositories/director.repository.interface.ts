// src/core/domain/interfaces/repositories/director.repository.interface.ts
import { Director } from "../../entities/director.entity";

export interface IDirectorRepository {
  create(director: Director): Promise<Director>;
  delete(id: string): Promise<boolean>;
}
