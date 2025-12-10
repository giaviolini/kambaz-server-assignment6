import UsersDao from "./dao.js";

export default function UserRoutes(app, db) {
  const dao = UsersDao(db);

  // --- CREATE USER (generic) ---
  const createUser = async (req, res) => {
    try {
      const newUser = await dao.createUser(req.body);
      res.json(newUser);
    } catch (err) {
      console.error("Create user error:", err);
      res.status(500).json({ message: "Server error" });
    }
  };

  // --- DELETE USER ---
  const deleteUser = async (req, res) => {
    try {
      const userId = req.params.userId;
      await dao.deleteUser(userId);
      res.sendStatus(204);
    } catch (err) {
      console.error("Delete user error:", err);
      res.status(500).json({ message: "Server error" });
    }
  };

  // --- FIND ALL USERS ---
  const findAllUsers = async (req, res) => {
    try {
      const users = await dao.findAllUsers();
      res.json(users);
    } catch (err) {
      console.error("Find all users error:", err);
      res.status(500).json({ message: "Server error" });
    }
  };

  // --- FIND USER BY ID ---
  const findUserById = async (req, res) => {
    try {
      const user = await dao.findUserById(req.params.userId);
      if (!user) return res.sendStatus(404);
      res.json(user);
    } catch (err) {
      console.error("Find user by ID error:", err);
      res.status(500).json({ message: "Server error" });
    }
  };

  // --- UPDATE USER ---
  const updateUser = async (req, res) => {
    try {
      const userId = req.params.userId;
      const userUpdates = req.body;
      await dao.updateUser(userId, userUpdates);
      const updatedUser = await dao.findUserById(userId);
      req.session.currentUser = updatedUser;
      res.json(updatedUser);
    } catch (err) {
      console.error("Update user error:", err);
      res.status(500).json({ message: "Server error" });
    }
  };

  // --- SIGNUP ---
  const signup = async (req, res) => {
    try {
      const existingUser = await dao.findUserByUsername(req.body.username);
      if (existingUser) return res.status(400).json({ message: "Username already in use" });

      const newUser = await dao.createUser(req.body);
      req.session.currentUser = newUser;
      res.json(newUser);
    } catch (err) {
      console.error("Signup error:", err);
      res.status(500).json({ message: "Server error" });
    }
  };

  // --- SIGNIN ---
  const signin = async (req, res) => {
    try {
      const { username, password } = req.body;
      const currentUser = await dao.findUserByCredentials(username, password);

      if (!currentUser) return res.status(401).json({ message: "Invalid credentials" });

      req.session.currentUser = currentUser;
      res.json(currentUser);
    } catch (err) {
      console.error("Signin error:", err);
      res.status(500).json({ message: "Server error" });
    }
  };

  // --- SIGNOUT ---
  const signout = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Signout error:", err);
        return res.status(500).json({ message: "Server error" });
      }
      res.sendStatus(200);
    });
  };

  // --- PROFILE ---
  const profile = (req, res) => {
    const currentUser = req.session.currentUser;
    if (!currentUser) return res.sendStatus(401);
    res.json(currentUser);
  };

  // --- ROUTES ---
  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
}
