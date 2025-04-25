import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

// Load environment variables
dotenv.config();

async function checkDatabase() {
  try {
    // Get the MongoDB URI from environment variables
    const uri = process.env.MONGO_URI || "";
    console.log(
      `Connecting to: ${uri.replace(/\/\/([^:]+):[^@]+@/, "//$1:****@")}`
    ); // Hide password in logs

    // Connect to MongoDB
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    // Check if db is defined
    if (!mongoose.connection.db) {
      console.error("Database connection not established");
      return;
    }

    // Get list of collections
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log("\nCollections in the database:");
    if (collections.length === 0) {
      console.log("No collections found. Creating users collection...");

      // Create a test user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("testpassword", salt);

      const result = await mongoose.connection.db
        .collection("users")
        .insertOne({
          email: "testuser@example.com",
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

      console.log(`Created test user with ID: ${result.insertedId}`);
    } else {
      collections.forEach((collection) => {
        console.log(`- ${collection.name}`);
      });
    }

    // Check the users collection again
    const userCount = await mongoose.connection.db
      .collection("users")
      .countDocuments();
    console.log(`\nUsers collection has ${userCount} documents`);

    // Show sample user (without sensitive data)
    if (userCount > 0) {
      const users = await mongoose.connection.db
        .collection("users")
        .find({}, { projection: { password: 0 } })
        .limit(3)
        .toArray();
      console.log("\nSample users (password hidden):");
      console.log(JSON.stringify(users, null, 2));
    }

    // Get database name
    console.log(`\nDatabase name: ${mongoose.connection.db.databaseName}`);

    // Clean up
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    process.exit();
  }
}

// Run the function
checkDatabase();
