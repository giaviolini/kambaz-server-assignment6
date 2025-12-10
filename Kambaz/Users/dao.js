import { v4 as uuidv4 } from "uuid";
export default function UsersDao(db) {
  const users = db.collection("users");
  const createUser = async (user) => {
    const newUser = { ...user, _id: uuidv4() };
    await users.insertOne(newUser);
    return newUser;
  };
 const findAllUsers = () => users;
 const findUserById = (userId) => users.find((user) => user._id === userId);
 const findUserByUsername = async (username) =>
  await users.findOne({ username });
 const findUserByCredentials = async (username, password) =>
  await users.findOne({ username, password });
 const updateUser = async (id, user) =>
  await users.updateOne({ _id: id }, { $set: user });
 const deleteUser = (userId) => (users = users.filter((u) => u._id !== userId));
 return {
   createUser, findAllUsers, findUserById, findUserByUsername, findUserByCredentials, updateUser, deleteUser };
}