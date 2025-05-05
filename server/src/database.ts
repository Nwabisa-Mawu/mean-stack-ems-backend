import mongoose from "mongoose";

// Connect to the MongoDB database
export async function connectToDatabase(uri: string) {
  try {
    await mongoose.connect(uri, {
      tls: true,
      tlsAllowInvalidCertificates: false,
      retryWrites: true,
      w: "majority",
      dbName: "firstnixcluster",
    });

    console.log("✅ Connected to MongoDB with Mongoose");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    throw error;
  }
}
