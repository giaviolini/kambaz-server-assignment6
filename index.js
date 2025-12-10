import "dotenv/config";

import express from 'express';
import Hello from "./Hello.js"
import Lab5 from "./Lab5/index.js";
import cors from "cors";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import ModulesRoutes from './Kambaz/Modules/routes.js';
import AssignmentsRoutes from './Kambaz/Assignments/routes.js';
import session from "express-session";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";


const app = express();
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL || "http://localhost:3000"
}));

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.DATABASE_CONNECTION_STRING,
    collectionName: "sessions",
  }),
  cookie: {
    sameSite: "none",                     
    secure: process.env.SERVER_ENV !== "development",  
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,      
  },
  proxy: process.env.SERVER_ENV !== "development",
};

app.use(session(sessionOptions));
app.use(express.json());

const DATABASE_CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING;

mongoose.connect(DATABASE_CONNECTION_STRING);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB error:"));
db.once("open", () => {
  console.log("MongoDB connected");

  
  UserRoutes(app, db);
  CourseRoutes(app, db);
  ModulesRoutes(app, db);
  AssignmentsRoutes(app, db);
  Lab5(app);
  Hello(app);

  app.listen(process.env.PORT || 4000, () =>
    console.log("Server running")
  );
});