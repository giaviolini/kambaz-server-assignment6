import EnrollmentsDao from "./dao.js";

export default function EnrollmentsRoutes(app) {
  const dao = EnrollmentsDao();

  // --- GET all courses the current user is enrolled in ---
  app.get("/api/users/:userId/courses", async (req, res) => {
    try {
      let { userId } = req.params;

      // Support "current" user
      if (userId === "current") {
        const currentUser = req.session["currentUser"];
        if (!currentUser) return res.sendStatus(401);
        userId = currentUser._id;
      }

      const courses = await dao.findCoursesForUser(userId);
      res.json(courses);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Unable to fetch user courses" });
    }
  });

  // --- GET all users enrolled in a specific course ---
  app.get("/api/courses/:courseId/users", async (req, res) => {
    try {
      const { courseId } = req.params;
      const users = await dao.findUsersForCourse(courseId);
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Unable to fetch enrolled users" });
    }
  });

  // --- ENROLL current user in a course ---
  app.post("/api/courses/:courseId/enroll", async (req, res) => {
    try {
      const { courseId } = req.params;
      const currentUser = req.session["currentUser"];
      if (!currentUser) return res.sendStatus(401);

      const enrollment = await dao.enrollUserInCourse(currentUser._id, courseId);
      res.json(enrollment);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Unable to enroll user" });
    }
  });

  // --- UNENROLL current user from a course ---
  app.post("/api/courses/:courseId/unenroll", async (req, res) => {
    try {
      const { courseId } = req.params;
      const currentUser = req.session["currentUser"];
      if (!currentUser) return res.sendStatus(401);

      await dao.unenrollUserFromCourse(currentUser._id, courseId);
      res.json({ status: "unenrolled" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Unable to unenroll user" });
    }
  });

  // --- OPTIONAL: Unenroll all users (used when course is deleted) ---
  app.delete("/api/courses/:courseId/enrollments", async (req, res) => {
    try {
      const { courseId } = req.params;
      await dao.unenrollAllUsersFromCourse(courseId);
      res.json({ status: "all users unenrolled" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Unable to remove all enrollments" });
    }
  });
}
