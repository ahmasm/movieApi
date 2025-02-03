// tests/mocks/dto.mocks.ts
export const mockCreateMovieDto = {
  title: "Test Movie",
  description: "Test Description",
  releaseDate: new Date("2024-01-01"),
  genre: "Action",
  rating: 8.5,
  imdbId: "tt1234567",
  directorId: "507f1f77bcf86cd799439011",
};

export const mockCreateDirectorDto = {
  firstName: "Christopher",
  secondName: "Nolan",
  birthDate: new Date("1970-07-30"),
  bio: "British-American film director",
};

// Mock validation results
export const mockValidationSuccess = [];
export const mockValidationError = [
  {
    property: "title",
    constraints: {
      isString: "title must be a string",
    },
  },
];
