// migrations/20240131000001-create-movies.js
module.exports = {
  async up(db) {
    await db.createCollection("movies", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["title", "description", "releaseDate", "genre", "rating", "imdbId", "directorId"],
          properties: {
            title: {
              bsonType: "string",
              minLength: 1,
              maxLength: 200,
              description: "Must be a string between 1 and 200 characters"
            },
            description: {
              bsonType: "string",
              minLength: 10,
              maxLength: 2000,
              description: "Must be a string between 10 and 2000 characters"
            },
            releaseDate: {
              bsonType: "date",
              description: "Must be a valid date"
            },
            genre: {
              enum: [
                "Action", "Adventure", "Animation", "Comedy", "Crime", 
                "Documentary", "Drama", "Family", "Fantasy", "Horror",
                "Mystery", "Romance", "Sci-Fi", "Thriller", "War", "Western"
              ],
              description: "Must be one of the predefined genres"
            },
            rating: {
              bsonType: "number",
              minimum: 0,
              maximum: 10,
              description: "Must be a number between 0 and 10"
            },
            imdbId: {
              bsonType: "string",
              pattern: "^tt\\d{7,8}$",
              description: "Must be a valid IMDb ID format (tt followed by 7-8 digits)"
            },
            directorId: {
              bsonType: "objectId",
              description: "Must be a valid ObjectId"
            },
            duration: {
              bsonType: "number",
              minimum: 1,
              maximum: 1000,
              description: "Duration in minutes, must be between 1 and 1000"
            },
            language: {
              bsonType: "array",
              items: {
                bsonType: "string"
              },
              minItems: 1,
              uniqueItems: true,
              description: "Array of languages the movie is available in"
            },
            tags: {
              bsonType: "array",
              items: {
                bsonType: "string"
              },
              uniqueItems: true,
              description: "Array of tags/keywords associated with the movie"
            },
            cast: {
              bsonType: "array",
              items: {
                bsonType: "string"
              },
              description: "Array of main cast members"
            }
          }
        }
      }
    });

    await db.collection("movies").createIndex({ imdbId: 1 }, { unique: true });
    await db.collection("movies").createIndex({ title: 1 });
    await db.collection("movies").createIndex({ genre: 1 });
    await db.collection("movies").createIndex({ "tags": 1 });
    await db.collection("movies").createIndex({ rating: -1 });
    await db.collection("movies").createIndex({ releaseDate: -1 });
  },

  async down(db) {
    await db.collection("movies").dropIndexes();
    await db.collection("movies").drop();
  }
};
