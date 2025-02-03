// migrations/20240131000002-create-directors.js
module.exports = {
  async up(db) {
    await db.createCollection("directors", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["firstName", "secondName", "birthDate", "bio"],
          properties: {
            firstName: {
              bsonType: "string",
              minLength: 1,
              maxLength: 50,
              description: "Must be a string between 1 and 50 characters"
            },
            secondName: {
              bsonType: "string",
              minLength: 1,
              maxLength: 50,
              description: "Must be a string between 1 and 50 characters"
            },
            birthDate: {
              bsonType: "date",
              description: "Must be a valid date"
            },
            bio: {
              bsonType: "string",
              minLength: 10,
              maxLength: 5000,
              description: "Must be a string between 10 and 5000 characters"
            },
            nationality: {
              bsonType: "string",
              description: "Director's nationality"
            },
            awards: {
              bsonType: "array",
              items: {
                bsonType: "object",
                required: ["name", "year"],
                properties: {
                  name: { bsonType: "string" },
                  year: { bsonType: "int" }
                }
              }
            },
            knownFor: {
              bsonType: "array",
              items: {
                bsonType: "string"
              }
            }
          }
        }
      }
    });

    await db.collection("directors").createIndex(
      { firstName: 1, secondName: 1 },
      { unique: true }
    );
    await db.collection("directors").createIndex({ nationality: 1 });
  },

  async down(db) {
    await db.collection("directors").dropIndexes();
    await db.collection("directors").drop();
  }
};
