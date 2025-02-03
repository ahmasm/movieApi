// src/application/dtos/director.dto.ts
import { IsString, IsDate } from "class-validator";
import { Type } from "class-transformer";

export class CreateDirectorDto {
  @IsString()
  firstName!: string;

  @IsString()
  secondName!: string;

  @Type(() => Date)
  @IsDate()
  birthDate!: Date;

  @IsString()
  bio!: string;
}
