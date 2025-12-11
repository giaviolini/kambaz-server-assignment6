import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import "dotenv/config";

// ROUTES
import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import ModulesRoutes from "./Kambaz/Modules/routes.js";
import AssignmentsRoutes from "./Kambaz/Assignments/routes.js";
import EnrollmentsRoutes from "./Kambaz/Enrollments/routes.js";

const app = express();

// --- MONGODB CONNECTION ---
const CONNECTION_STRING =
  process.env.DATABASE_CONNECTION_STRING ||
  "mongodb://127.0.0.1:27017/kambaz"; // local fallback for dev

mongoose
  .connect(CONNECTION_STRING)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // fail fast if DB cannot connect
  });

// --- MIDDLEWARE ---
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
};

// Production cookie settings
if (process.env.SERVER_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    // optional: domain: process.env.SERVER_URL
  };
}

app.use(session(sessionOptions));
app.use(express.json());

// --- ROUTES ---
UserRoutes(app);           // Users
CourseRoutes(app);         // Courses
ModulesRoutes(app);        // Modules
AssignmentsRoutes(app);    // Assignments
EnrollmentsRoutes(app);    // Enrollments
Lab5(app);                 // Lab5 endpoints
Hello(app);                // Hello endpoints

// --- START SERVER ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
