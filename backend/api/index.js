// This file serves as the entry point for Vercel serverless functions
// It simply re-exports the Express app from our compiled code

// For local development:
// This is a shim that allows us to use Vercel's functions locally
if (process.env.NODE_ENV === "development") {
  // In development, run the actual Express server
  require("../dist/index.js");
} else {
  // In production, export the Express app for Vercel
  module.exports = require("../dist/index.js");
}
