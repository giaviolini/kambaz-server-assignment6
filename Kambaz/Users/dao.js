import { v4 as uuidv4 } from "uuid";

export default function UsersDao(db) {
  const users = db.collection("users");

  // --- CREATE USER ---
  const createUser = async (user) => {
    const newUser = { ...user, _id: uuidv4() };
    await users.insertOne(newUser);
    return newUser;
  };

  // --- FIND ALL USERS ---
  const findAllUsers = async () => {
    return await users.find({}).toArray();
  };

  // --- FIND USER BY ID ---
  const findUserById = async (userId) => {
    return await users.findOne({ _id: userId });
  };

  // --- FIND USER BY USERNAME ---
  const findUserByUsername = async (username) => {
    return await users.findOne({ username });
  };

  // --- FIND USER BY CREDENTIALS ---
  const findUserByCredentials = async (username, password) => {
    return await users.findOne({ username, password });
  };

  // --- UPDATE USER ---
  const updateUser = async (id, userUpdates) => {
    await users.updateOne({ _id: id }, { $set: userUpdates });
    return await findUserById(id);
  };

  // --- DELETE USER ---
  const deleteUser = async (userId) => {
    await users.deleteOne({ _id: userId });
  };

  return {
    createUser,
    findAllUsers,
    findUserById,
    findUserByUsername,
    findUserByCredentials,
    updateUser,
    deleteUser,
  };
}