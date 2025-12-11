import CoursesDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";

export default function CourseRoutes(app) {
  const dao = CoursesDao();
  const enrollmentsDao = EnrollmentsDao();

  // --- CREATE COURSE ---
  const createCourse = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) return res.sendStatus(401);

      const newCourse = await dao.createCourse(req.body);

      // Auto-enroll creator in the course
      await enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);

      res.json(newCourse);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  };

  // --- GET ALL COURSES ---
  const findAllCourses = async (req, res) => {
    try {
      const courses = await dao.findAllCourses();
      res.json(courses);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  };

  // --- GET COURSES FOR A USER (enrolled) ---
  const findCoursesForEnrolledUser = async (req, res) => {
    try {
      let { userId } = req.params;

      if (userId === "current") {
        const currentUser = req.session["currentUser"];
        if (!currentUser) return res.sendStatus(401);
        userId = currentUser._id;
      }

      const courses = await dao.findCoursesForEnrolledUser(userId);
      res.json(courses);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  };

  // --- UPDATE COURSE ---
  const updateCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const updatedCourse = await dao.updateCourse(courseId, req.body);
      res.json(updatedCourse);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  };

  // --- DELETE COURSE ---
  const deleteCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const status = await dao.deleteCourse(courseId);
      res.json(status);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  };

  // --- ROUTES ---
  app.post("/api/users/current/courses", createCourse);
  app.get("/api/courses", findAllCourses);
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
  app.put("/api/courses/:courseId", updateCourse);
  app.delete("/api/courses/:courseId", deleteCourse);
}
