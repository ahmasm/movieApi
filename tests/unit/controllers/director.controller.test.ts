// tests/unit/controllers/director.controller.test.ts
import { Request, Response, NextFunction } from "express";
import { DirectorController } from "../../../src/presentation/controllers/director.controller";
import { DirectorService } from "../../../src/application/services/director.service";
import { CreateDirectorDto } from "../../../src/application/dtos/director.dto";
import { Director } from "../../../src/core/domain/entities/director.entity";
import { NotFoundError } from "../../../src/core/domain/errors/not-found.error";
import { IDirectorRepository } from "../../../src/core/domain/interfaces/repositories/director.repository.interface";

jest.mock("../../../src/application/services/director.service");

describe("DirectorController", () => {
  let directorController: DirectorController;
  let directorService: jest.Mocked<DirectorService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    // Provide a stub/mock for the director repository.
    const directorRepositoryStub: Partial<IDirectorRepository> = {
      create: jest.fn(),
      delete: jest.fn(),
    };

    // Instantiate DirectorService with the stub.
    directorService = new DirectorService(
      directorRepositoryStub as IDirectorRepository,
    ) as jest.Mocked<DirectorService>;

    // Stub out the service methods as needed.
    directorService.createDirector = jest.fn();
    directorService.deleteDirector = jest.fn();

    directorController = new DirectorController(directorService);

    mockRequest = {
      body: {},
      params: {},
    };

    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    nextFunction = jest.fn();
  });

  describe("createDirector", () => {
    const mockDirectorDto: CreateDirectorDto = {
      firstName: "Christopher",
      secondName: "Nolan",
      birthDate: new Date("1970-07-30"),
      bio: "British-American film director",
    };

    const mockDirector = {
      id: "507f1f77bcf86cd799439011",
      ...mockDirectorDto,
    };

    it("should create a director successfully", async () => {
      mockRequest.body = mockDirectorDto;
      directorService.createDirector.mockResolvedValue(
        mockDirector as unknown as Director,
      );

      await directorController.createDirector(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(directorService.createDirector).toHaveBeenCalledWith(
        mockDirectorDto,
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockDirector);
    });

    it("should handle validation errors", async () => {
      mockRequest.body = { firstName: "Christopher" }; // Missing required fields

      await directorController.createDirector(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Validation failed",
        }),
      );
    });
  });

  describe("deleteDirector", () => {
    it("should delete a director successfully", async () => {
      mockRequest.params = { id: "1" };
      directorService.deleteDirector.mockResolvedValue(undefined);

      await directorController.deleteDirector(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(directorService.deleteDirector).toHaveBeenCalledWith("1");
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it("should handle not found error", async () => {
      mockRequest.params = { id: "999" };
      directorService.deleteDirector.mockRejectedValue(
        new NotFoundError("Director not found"),
      );

      await directorController.deleteDirector(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(nextFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Director not found",
        }),
      );
    });
  });
});
