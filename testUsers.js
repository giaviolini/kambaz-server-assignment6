import mongoose from "mongoose";
import UsersDao from "./Kambaz/Users/dao.js";

const DATABASE_CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING 
  || "mongodb+srv://giaviolini:ZiggyWiggy1715@cluster0.gnv0zci.mongodb.net/kambaz?appName=Cluster0";

mongoose.connect(DATABASE_CONNECTION_STRING);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB error:"));

db.once("open", async () => {
  console.log("MongoDB connected for testing");

  const nativeDb = mongoose.connection.getClient().db("kambaz");
  const dao = UsersDao(nativeDb);

  const allUsers = await dao.findAllUsers();
  console.log("All users in DB:", allUsers);

  const testUser = await dao.findUserByCredentials("iron_man", "stark123");
  console.log("User found by credentials:", testUser);

  process.exit(0); // End script after running
});