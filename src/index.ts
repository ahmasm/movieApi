// src/index.ts
import "reflect-metadata";
import app from "./app";
import { connectDatabase } from "./infrastructure/config/database.config";

const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Start server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(
        `Swagger documentation available at http://localhost:${PORT}/api-docs`,
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer().catch((error) => {
  console.error("Unhandled server error:", error);
  process.exit(1);
});
