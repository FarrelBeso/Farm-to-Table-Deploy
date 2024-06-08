import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import authRoutes from "./routers/auth.js";
import adminRoutes from "./routers/admin.js";
import customerRoutes from "./routers/customer.js";
import reportRoutes from "./routers/report.js";
import * as path from "path";

// prepare the dot env
dotenv.config();
// connect to express app
const app = express();
// middleware
app.use(bodyParser.json());
app.use(cors());

// mount the route files here
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/customer", customerRoutes);
app.use("/report", reportRoutes);

app.use(express.static(path.join(__dirname, "build")));

// connect to mongoDB
// const dbURI = "mongodb://127.0.0.1:27017/farm-to-table";
const dbURI = process.env.MONGODB_URI;
const port = process.env.PORT || 3001;

mongoose
  .connect(dbURI, {})
  .then(() => {
    app.listen(port, () => {
      console.log(`Server connected to port ${port} and MongoDB`);
    });
  })
  .catch((error) => {
    console.log("Unable to connect to Server and/or MongoDB", error);
  });
