import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";

import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import ModulesRoutes from "./Kambaz/Modules/routes.js";
import AssignmentsRoutes from "./Kambaz/Assignments/routes.js";

const app = express();

// CORS
app.use(cors({
  credentials: true,
  origin: [
    "http://localhost:3000",
    "https://kambaz-next-js-hazel.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

// Session
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.SERVER_ENV !== "development",
    httpOnly: true,
    sameSite: process.env.SERVER_ENV !== "development" ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
};

if (process.env.SERVER_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie.domain = process.env.SERVER_URL;
}

app.use(session(sessionOptions));
app.use(express.json());

// MongoDB connection
const DATABASE_CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING 
  || "mongodb+srv://giaviolini:ZiggyWiggy1715@cluster0.gnv0zci.mongodb.net/kambaz?appName=Cluster0";

mongoose.connect(DATABASE_CONNECTION_STRING);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB error:"));
db.once("open", async () => {
  console.log("MongoDB connected");

  // Explicitly pass DB name (match the name in your connection string)
  const nativeDb = mongoose.connection.getClient().db("kambaz"); 

  // Routes
  UserRoutes(app, nativeDb);
  CourseRoutes(app, nativeDb);
  ModulesRoutes(app, nativeDb);
  AssignmentsRoutes(app, nativeDb);
  Lab5(app);
  Hello(app);

  app.listen(process.env.PORT || 4000, () => {
    console.log(`Server running on port ${process.env.PORT || 4000}`);
  });
});
