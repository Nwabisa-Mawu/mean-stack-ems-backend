import mongoose, { Schema, model } from "mongoose";
import { Employee } from "./employee";

// Mongoose schema definition matching the TypeScript interface
// Update our existing collection with JSON schema validation so we 
// know our documents will always match the shape of our Employee model, even if added elsewhere.
/**
 * We're also using schema validation to ensure that all of our documents 
 * follow the shape of our Employee interface. This is a good practice to ensure that we 
 * don't accidentally store data that doesn't match the shape of our model. 
 */
const employeeSchema = new Schema<Employee>({
  name: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
    minlength: 5,
  },
  level: {
    type: String,
    required: true,
    enum: ["junior", "mid", "senior"],
  },
}, {
  versionKey: false,
});

// Export the Mongoose model
export const EmployeeModel = model<Employee>("Employee", employeeSchema);

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
