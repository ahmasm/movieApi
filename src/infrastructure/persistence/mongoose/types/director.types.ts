import { Document } from "mongoose";

export interface IDirectorDocument extends IDirectorBase, Document {}

export interface IDirectorBase {
  firstName: string;
  secondName: string;
  birthDate: Date;
  bio: string;
  nationality?: string;
  awards?: { name: string; year: number }[];
  knownFor?: string[];
}
