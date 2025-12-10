import UsersDao from "./dao.js";

export default function UserRoutes(app) {
  const dao = UsersDao();

  const createUser = async (req, res) => {
    const user = await dao.createUser(req.body);
    res.json(user);
  };

  const deleteUser = async (req, res) => {
    const status = await dao.deleteUser(req.params.userId);
    res.json(status);
  };

  const findAllUsers = async (req, res) => {
    const { role, name } = req.query;

    if (role) {
      const users = await dao.findUsersByRole(role);
      res.json(users);
      return;
    }

    if (name) {
      const users = await dao.findUsersByPartialName(name);
      res.json(users);
      return;
    }

    const users = await dao.findAllUsers();
    res.json(users);
  };

  const findUserById = async (req, res) => {
    const user = await dao.findUserById(req.params.userId);
    res.json(user);
  };

  const updateUser = async (req, res) => {
    const userId = req.params.userId;
    const updates = req.body;

    await dao.updateUser(userId, updates);

    // Keep session in sync
    const currentUser = req.session["currentUser"];
    let updatedUser = null;

    if (currentUser && currentUser._id === userId) {
      updatedUser = { ...currentUser, ...updates };
      req.session["currentUser"] = updatedUser;
    }

    // Return updated user if it's the current user,
    // otherwise return just a success message
    res.json(updatedUser ?? { status: "updated" });
  };

  const signup = async (req, res) => {
    const existing = await dao.findUserByUsername(req.body.username);

    if (existing) {
      res.status(400).json({ message: "Username already in use" });
      return;
    }

    const user = await dao.createUser(req.body);
    req.session["currentUser"] = user;
    res.json(user);
  };

  const signin = async (req, res) => {
    const { username, password } = req.body;
    const user = await dao.findUserByCredentials(username, password);

    if (!user) {
      res.status(401).json({ message: "Unable to login. Try again later." });
      return;
    }

    req.session["currentUser"] = user;
    res.json(user);
  };

  const signout = async (req, res) => {
    req.session.destroy(() => {
      res.sendStatus(200);
    });
  };

  const profile = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    res.json(currentUser);
  };

  // ROUTES
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
