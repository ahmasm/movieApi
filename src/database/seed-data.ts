// src/database/seed-data.ts
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/moviedb";

async function seedDatabase() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();

    // Clear existing data
    await db.collection("directors").deleteMany({});
    await db.collection("movies").deleteMany({});

    // Insert directors
    const directors = await db.collection("directors").insertMany([
      {
        firstName: "Christopher",
        secondName: "Nolan",
        birthDate: new Date("1970-07-30"),
        bio: "British-American film director known for complex, nonlinear storytelling.",
        nationality: "British-American",
        awards: [
          { name: "Academy Award for Best Director", year: 2018 },
          { name: "BAFTA Award", year: 2011 },
        ],
        knownFor: ["Inception", "The Dark Knight", "Interstellar"],
      },
      {
        firstName: "Martin",
        secondName: "Scorsese",
        birthDate: new Date("1942-11-17"),
        bio: "American film director, producer, screenwriter, and actor.",
        nationality: "American",
        awards: [
          { name: "Academy Award for Best Director", year: 2007 },
          { name: "AFI Life Achievement Award", year: 1997 },
        ],
        knownFor: ["Goodfellas", "The Departed", "Taxi Driver"],
      },
      {
        firstName: "Quentin",
        secondName: "Tarantino",
        birthDate: new Date("1963-03-27"),
        bio: "American filmmaker known for nonlinear storylines and stylized violence.",
        nationality: "American",
        awards: [
          { name: "Academy Award for Best Original Screenplay", year: 1995 },
          { name: "Palme d'Or", year: 1994 },
        ],
        knownFor: ["Pulp Fiction", "Kill Bill", "Django Unchained"],
      },
    ]);

    // Insert movies for each director
    const movies = [
      {
        directorId: directors.insertedIds[0],
        title: "Inception",
        description:
          "A thief who steals corporate secrets through dream-sharing technology is given the task of planting an idea into the mind of a C.E.O.",
        releaseDate: new Date("2010-07-16"),
        genre: "Sci-Fi",
        rating: 8.8,
        imdbId: "tt1375666",
        duration: 148,
        language: ["English", "Japanese", "French"],
        tags: ["dream", "subconscious", "heist", "mind-bending"],
        cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page"],
      },
      {
        directorId: directors.insertedIds[0],
        title: "Interstellar",
        description:
          "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        releaseDate: new Date("2014-11-07"),
        genre: "Sci-Fi",
        rating: 8.6,
        imdbId: "tt0816692",
        duration: 169,
        language: ["English"],
        tags: ["space", "time-travel", "survival", "physics"],
        cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
      },
      {
        directorId: directors.insertedIds[1],
        title: "The Departed",
        description:
          "An undercover cop and a mole in the police attempt to identify each other while infiltrating an Irish gang in South Boston.",
        releaseDate: new Date("2006-10-06"),
        genre: "Crime",
        rating: 8.5,
        imdbId: "tt0407887",
        duration: 151,
        language: ["English"],
        tags: ["crime", "police", "undercover", "boston"],
        cast: ["Leonardo DiCaprio", "Matt Damon", "Jack Nicholson"],
      },
      {
        directorId: directors.insertedIds[2],
        title: "Pulp Fiction",
        description:
          "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
        releaseDate: new Date("1994-10-14"),
        genre: "Crime",
        rating: 8.9,
        imdbId: "tt0110912",
        duration: 154,
        language: ["English", "Spanish", "French"],
        tags: ["crime", "nonlinear", "dark-humor", "violence"],
        cast: ["John Travolta", "Uma Thurman", "Samuel L. Jackson"],
      },
    ];

    await db.collection("movies").insertMany(movies);

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.close();
  }
}

seedDatabase();
