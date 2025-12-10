import CoursesDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";

export default function CourseRoutes(app, db) {
  const dao = CoursesDao(db);
  const enrollmentsDao = EnrollmentsDao(db);

  // CREATE COURSE
  const createCourse = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) return res.sendStatus(401);

      const newCourse = await dao.createCourse(req.body);

      await enrollmentsDao.enrollUserInCourse(
        currentUser._id,
        newCourse._id
      );

      res.json(newCourse);
    } catch (e) {
      console.error("Create course error:", e);
      res.status(500).send("Internal Server Error");
    }
  };

  // GET ALL COURSES
  const findAllCourses = async (req, res) => {
    try {
      const courses = await dao.findAllCourses();
      res.json(courses);
    } catch (e) {
      console.error("Find all courses error:", e);
      res.status(500).send("Internal Server Error");
    }
  };

  // GET COURSES FOR USER
  const findCoursesForEnrolledUser = async (req, res) => {
    try {
      let { userId } = req.params;

      if (userId === "current") {
        const currentUser = req.session["currentUser"];
        if (!currentUser) return res.sendStatus(401);
        userId = currentUser._id;
      }

      const courses = await enrollmentsDao.findCoursesForUser(userId);
      res.json(courses);
    } catch (e) {
      console.error("Find courses for user error:", e);
      res.status(500).send("Internal Server Error");
    }
  };

  // DELETE COURSE
  const deleteCourse = async (req, res) => {
    try {
      const { courseId } = req.params;

      await enrollmentsDao.unenrollAllUsersFromCourse(courseId);
      const status = await dao.deleteCourse(courseId);

      res.json(status);
    } catch (e) {
      console.error("Delete course error:", e);
      res.status(500).send("Internal Server Error");
    }
  };

  // UPDATE COURSE
  const updateCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const updatedCourse = await dao.updateCourse(courseId, req.body);
      res.json(updatedCourse);
    } catch (e) {
      console.error("Update course error:", e);
      res.status(500).send("Internal Server Error");
    }
  };

  // ROUTES
  app.put("/api/courses/:courseId", updateCourse);
  app.delete("/api/courses/:courseId", deleteCourse);
  app.post("/api/users/current/courses", createCourse);
  app.get("/api/courses", findAllCourses);
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
}