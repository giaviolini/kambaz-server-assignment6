import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import "dotenv/config";

// Import your route modules
import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import ModulesRoutes from "./Kambaz/Modules/routes.js";
import AssignmentsRoutes from "./Kambaz/Assignments/routes.js";
import EnrollmentsRoutes from "./Kambaz/Enrollments/routes.js";

const app = express();

// --- MongoDB Connection ---
const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING;

if (!CONNECTION_STRING) {
  console.error("Error: DATABASE_CONNECTION_STRING not set!");
  process.exit(1);
}

mongoose.connect(CONNECTION_STRING)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// --- Middleware ---
app.use(express.json());

// CORS configuration
app.use(
  cors({
    origin: "https://kambaz-next-js-kohl.vercel.app", 
    credentials: true, 
  })
);

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: "none",  // cross-site cookie
    secure: true,      // HTTPS required
    httpOnly: true,    // prevents client-side JS from reading the cookie
    maxAge: 1000 * 60 * 60 * 24, // optional, 1 day
  },
  proxy: true, // necessary on Render for HTTPS behind a proxy
};

app.use(session(sessionOptions));


// Debugging middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// --- Routes ---
UserRoutes(app);
CourseRoutes(app);
ModulesRoutes(app);
AssignmentsRoutes(app);
EnrollmentsRoutes(app);
Lab5(app);
Hello(app);

// --- Start Server ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
