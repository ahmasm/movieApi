import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { NotFoundError, DuplicateKeyError } from "../../core/domain/errors";
import { ValidationError } from "class-validator";
import mongoose from "mongoose";

interface MongoDBDuplicateKeyError extends mongoose.Error {
  code: number;
  keyValue: Record<string, string>;
}

export const errorMiddleware: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): Response => {
  console.error("Error caught in middleware:", err);

  if (err instanceof NotFoundError) {
    return res.status(404).json({
      status: "error",
      message: err.message,
    });
  }

  if (err instanceof DuplicateKeyError) {
    return res.status(409).json({
      status: "error",
      message: err.message,
    });
  }

  if (err instanceof ValidationError) {
    return res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: err,
    });
  }

  // Handle Mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: Object.values(err.errors).map((error) => ({
        field: error.path,
        message: error.message,
      })),
    });
  }

  // Handle MongoDB duplicate key error (code 11000)
  if ("code" in err && (err as MongoDBDuplicateKeyError).code === 11000) {
    const mongoError = err as MongoDBDuplicateKeyError; // Use the defined interface
    const field = Object.keys(mongoError.keyValue)[0];
    const value = mongoError.keyValue[field];

    return res.status(409).json({
      status: "error",
      message: `A record with this ${field} (${value}) already exists`,
    });
  }

  return res.status(500).json({
    status: "error",
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};
