// src/presentation/routes/director.routes.ts
import { Router } from "express";
import { DirectorController } from "../controllers/director.controller";

/**
 * @swagger
 * tags:
 *   name: Directors
 *   description: Director management endpoints
 */

export const createDirectorRouter = (
  directorController: DirectorController,
) => {
  const router = Router();

  /**
   * @swagger
   * /api/directors:
   *   post:
   *     tags: [Directors]
   *     summary: Create a new director
   *     description: Create a new director with the provided information
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - firstName
   *               - secondName
   *               - birthDate
   *               - bio
   *             properties:
   *               firstName:
   *                 type: string
   *                 example: "Christopher"
   *               secondName:
   *                 type: string
   *                 example: "Nolan"
   *               birthDate:
   *                 type: string
   *                 format: date
   *                 example: "1970-07-30"
   *               bio:
   *                 type: string
   *                 example: "British-American film director"
   *     responses:
   *       201:
   *         description: Director created successfully
   *       400:
   *         description: Invalid input data
   */
  router.post("/", directorController.createDirector);

  /**
   * @swagger
   * /api/directors/{id}:
   *   delete:
   *     tags: [Directors]
   *     summary: Delete a director
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Director ID
   *     responses:
   *       204:
   *         description: Director deleted successfully
   *       404:
   *         description: Director not found
   *       409:
   *         description: Cannot delete director with associated movies
   */
  router.delete("/:id", directorController.deleteDirector);

  return router;
};
