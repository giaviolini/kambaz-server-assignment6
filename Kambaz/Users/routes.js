import UsersDao from "./dao.js";

export default function UserRoutes(app) {
  const dao = UsersDao();

  // --- CREATE USER ---
  const createUser = async (req, res) => {
    const user = await dao.createUser(req.body);
    res.json(user);
  };

  // --- DELETE USER ---
  const deleteUser = async (req, res) => {
    const status = await dao.deleteUser(req.params.userId);
    res.json(status);
  };

  // --- FIND ALL USERS ---
  const findAllUsers = async (req, res) => {
    const { role, name } = req.query;
    if (role) return res.json(await dao.findUsersByRole(role));
    if (name) return res.json(await dao.findUsersByPartialName(name));
    res.json(await dao.findAllUsers());
  };

  // --- FIND USER BY ID ---
  const findUserById = async (req, res) => {
    const user = await dao.findUserById(req.params.userId);
    res.json(user);
  };

  // --- UPDATE USER ---
  const updateUser = async (req, res) => {
    const userId = req.params.userId;
    const updatedUser = await dao.updateUser(userId, req.body);

    // Update session if current user
    const currentUser = req.session.currentUser;
    if (currentUser && currentUser._id === userId) {
      req.session.currentUser = { ...currentUser, ...req.body };
    }

    res.json(updatedUser);
  };

  // --- SIGNUP ---
  const signup = async (req, res) => {
    console.log("Signup body:", req.body);
    const user = await dao.findUserByUsername(req.body.username);
    if (user) return res.status(400).json({ message: "Username already in use" });

    const newUser = await dao.createUser(req.body);
    req.session.currentUser = newUser; // store in session
    res.json(newUser);
  };

  // --- SIGNIN ---
  const signin = async (req, res) => {
    console.log("SIGNIN REQUEST BODY:", req.body);
  
    const { username, password } = req.body;
  
    const currentUser = await dao.findUserByCredentials(username, password);
  
    console.log("SIGNIN RESULT FROM DB:", currentUser);
  
    if (!currentUser) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  
    req.session.currentUser = currentUser;
    res.json(currentUser);
  };

  // --- SIGNOUT ---
  const signout = async (req, res) => {
    req.session.destroy(err => {
      if (err) return res.status(500).json({ message: "Error signing out" });
      res.clearCookie("connect.sid", { path: "/" });
      res.sendStatus(200);
    });
  };

  // --- PROFILE ---
  const profile = async (req, res) => {
    const currentUser = req.session.currentUser;
    if (!currentUser) return res.sendStatus(401);
    res.json(currentUser);
  };

  // --- Routes ---
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
