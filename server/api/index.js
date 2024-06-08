import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import authRoutes from "../routers/auth.js";
import adminRoutes from "../routers/admin.js";
import customerRoutes from "../routers/customer.js";
import reportRoutes from "../routers/report.js";

// prepare the dot env
dotenv.config({ path: "../.env" });
// connect to express app
const app = express();
// middleware
app.use(bodyParser.json());
// app.use(
//   cors({
//     origin: [
//       "http://localhost:3000",
//       "https://farm-to-table-deploy-ytso.vercel.app",
//     ],
//     methods: ["GET", "POST", "OPTIONS", "PATCH", "DELETE", "PUT"],
//     allowedHeaders: [
//       "X-CSRF-Token",
//       "X-Requested-With",
//       "Accept",
//       "Accept-Version",
//       "Content-Length",
//       "Content-MD5",
//       "Content-Type",
//       "Date",
//       "X-Api-Version",
//     ],
//     credentials: "true",
//   })
// );
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// debugging
app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World!" });
});

// mount the route files here
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/customer", customerRoutes);
app.use("/report", reportRoutes);

// connect to mongoDB
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

export default app;
