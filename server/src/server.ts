import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectToDatabase } from "./database";
import employeeRouter from "./route-endpoints/employee.routes";

dotenv.config();

const { ATLAS_URI, PORT = 5200 } = process.env;

if (!ATLAS_URI) {
  console.error("❌ No ATLAS_URI environment variable defined");
  process.exit(1);
}

connectToDatabase(ATLAS_URI).then(() => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use("/api/employees", employeeRouter);

  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error("❌ Server failed to start:", error);
});
