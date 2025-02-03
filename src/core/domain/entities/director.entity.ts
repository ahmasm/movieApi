// src/core/domain/entities/director.entity.ts
export class Director {
  constructor(
    public readonly id: string | undefined,
    public readonly firstName: string,
    public readonly secondName: string,
    public readonly birthDate: Date,
    public readonly bio: string,
  ) {
    this.validateBirthDate(birthDate);
  }

  private validateBirthDate(birthDate: Date): void {
    if (birthDate > new Date()) {
      throw new Error("Birth date cannot be in the future");
    }
  }
}
