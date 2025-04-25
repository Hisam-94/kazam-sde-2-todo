// This file serves as the entry point for Vercel serverless functions

// Handle different environments and build states
let app;

try {
  // First try to import the compiled JavaScript
  app = require("../dist/index.js");
} catch (error) {
  try {
    // If compiled version doesn't exist, try to use ts-node for direct TS execution
    require("ts-node/register");
    app = require("../src/index.ts");
  } catch (tsError) {
    // If both fail, return an error response
    app = (req, res) => {
      res.status(500).json({
        error: "Server initialization failed",
        message: "The server could not start properly. Please check the logs.",
        timestamp: new Date().toISOString(),
      });
    };
    console.error("Failed to load application:", tsError);
  }
}

// Export the app for Vercel
module.exports = app;
