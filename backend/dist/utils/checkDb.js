"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
// Load environment variables
dotenv_1.default.config();
async function checkDatabase() {
    try {
        // Get the MongoDB URI from environment variables
        const uri = process.env.MONGO_URI || "";
        console.log(`Connecting to: ${uri.replace(/\/\/([^:]+):[^@]+@/, "//$1:****@")}`); // Hide password in logs
        // Connect to MongoDB
        await mongoose_1.default.connect(uri);
        console.log("Connected to MongoDB");
        // Check if db is defined
        if (!mongoose_1.default.connection.db) {
            console.error("Database connection not established");
            return;
        }
        // Get list of collections
        const collections = await mongoose_1.default.connection.db
            .listCollections()
            .toArray();
        console.log("\nCollections in the database:");
        if (collections.length === 0) {
            console.log("No collections found. Creating users collection...");
            // Create a test user
            const salt = await bcrypt_1.default.genSalt(10);
            const hashedPassword = await bcrypt_1.default.hash("testpassword", salt);
            const result = await mongoose_1.default.connection.db
                .collection("users")
                .insertOne({
                email: "testuser@example.com",
                password: hashedPassword,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            console.log(`Created test user with ID: ${result.insertedId}`);
        }
        else {
            collections.forEach((collection) => {
                console.log(`- ${collection.name}`);
            });
        }
        // Check the users collection again
        const userCount = await mongoose_1.default.connection.db
            .collection("users")
            .countDocuments();
        console.log(`\nUsers collection has ${userCount} documents`);
        // Show sample user (without sensitive data)
        if (userCount > 0) {
            const users = await mongoose_1.default.connection.db
                .collection("users")
                .find({}, { projection: { password: 0 } })
                .limit(3)
                .toArray();
            console.log("\nSample users (password hidden):");
            console.log(JSON.stringify(users, null, 2));
        }
        // Get database name
        console.log(`\nDatabase name: ${mongoose_1.default.connection.db.databaseName}`);
        // Clean up
        await mongoose_1.default.disconnect();
        console.log("Disconnected from MongoDB");
    }
    catch (error) {
        console.error("Error:", error);
    }
    finally {
        process.exit();
    }
}
// Run the function
checkDatabase();
