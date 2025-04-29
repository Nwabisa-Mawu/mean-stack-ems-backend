import * as express from "express";
import { ObjectId } from "mongodb";
import { EmployeeModel } from "./database";

//GET
const employeeRouter = express.Router();

employeeRouter.get("/", async (_req, res) => {
  try {
    const employees = await EmployeeModel.find();
    res.status(200).send(employees);
  } catch (error) {
    res.status(500).send(error instanceof Error ? error.message : "Unknown error");
  }
});

employeeRouter.get("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new ObjectId(id) };
        const employee = await await EmployeeModel.find(query);

        if (employee) {
            res.status(200).send(employee);
        } else {
            res.status(404).send(`Failed to find an employee: ID ${id}`);
        }
    } catch (error) {
        res.status(404).send(`Failed to find an employee: ID ${req?.params?.id}`);
    }
});

//ADD NEW EMPLOYEE - POST
employeeRouter.post("/", async (req, res) => {
    try {
        const employee = req.body;
        const result = await EmployeeModel.create(employee);

        if (result) {
            res.status(201).send(`Created a new employee: ID ${result._id}.`);
        } else {
            res.status(500).send("Failed to create a new employee.");
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
});

//UPDATE EMPLOYEE - PUT
employeeRouter.put("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const employee = req.body;
        const query = { _id: new ObjectId(id) };
        const result = await EmployeeModel.updateOne(query, { $set: employee });

        if (result && result.matchedCount) {
            res.status(200).send(`Updated an employee: ID ${id}.`);
        } else if (!result?.matchedCount) {
            res.status(404).send(`Failed to find an employee: ID ${id}`);
        } else {
            res.status(304).send(`Failed to update an employee: ID ${id}`);
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(message);
        res.status(400).send(message);
    }
});

//DELETE EMPLOYEE - DELETE
employeeRouter.delete("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new ObjectId(id) };
        const result = await EmployeeModel.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Removed an employee: ID ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove an employee: ID ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Failed to find an employee: ID ${id}`);
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(message);
        res.status(400).send(message);
    }
});

export default employeeRouter;