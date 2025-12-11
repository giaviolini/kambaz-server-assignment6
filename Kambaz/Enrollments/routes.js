import EnrollmentsDao from "../Enrollments/dao.js";

export default function EnrollmentsRoutes(app) {
  const dao = EnrollmentsDao();

  // --- GET COURSES FOR A USER ---
  const findCoursesForUser = async (req, res) => {
    let { userId } = req.params;
    try {
      if (userId === "current") {
        const currentUser = req.session["currentUser"];
        if (!currentUser) return res.sendStatus(401);
        userId = currentUser._id;
      }
      const courses = await dao.findCoursesForUser(userId);
      res.json(courses);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  };

  // --- GET USERS ENROLLED IN A COURSE ---
  const findUsersForCourse = async (req, res) => {
    const { courseId } = req.params;
    try {
      const users = await dao.findUsersForCourse(courseId);
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  };

  // --- ENROLL A USER IN A COURSE ---
  const enrollUser = async (req, res) => {
    const { courseId } = req.params;
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) return res.sendStatus(401);

      const enrollment = await dao.enrollUserInCourse(currentUser._id, courseId);
      res.json(enrollment);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  };

  // --- UNENROLL A USER FROM A COURSE ---
  const unenrollUser = async (req, res) => {
    const { courseId } = req.params;
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) return res.sendStatus(401);

      await dao.unenrollUserFromCourse(currentUser._id, courseId);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  };

  // ROUTES
  app.get("/api/users/:userId/courses/enrolled", findCoursesForUser);
  app.get("/api/courses/:courseId/users", findUsersForCourse);
  app.post("/api/courses/:courseId/enroll", enrollUser);
  app.post("/api/courses/:courseId/unenroll", unenrollUser);
}

