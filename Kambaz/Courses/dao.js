import { v4 as uuidv4 } from "uuid";
import CourseModel from "./model.js";       // Mongoose model for courses
import EnrollmentModel from "../Enrollments/model.js"; // Mongoose model for enrollments

export default function CoursesDao() {

  // --- FIND ALL COURSES ---
  const findAllCourses = async () => {
    return await CourseModel.find();
  };

  // --- FIND COURSES FOR A USER (ENROLLED) ---
  const findCoursesForEnrolledUser = async (userId) => {
    const enrollmentDocs = await EnrollmentModel.find({ user: userId });
    const courseIds = enrollmentDocs.map((e) => e.course);
    return await CourseModel.find({ _id: { $in: courseIds } });
  };

  // --- CREATE COURSE ---
  const createCourse = async (course) => {
    const newCourse = { ...course, _id: uuidv4() };
    return await CourseModel.create(newCourse);
  };

  // --- DELETE COURSE ---
  const deleteCourse = async (courseId) => {
    await CourseModel.findByIdAndDelete(courseId);
    await EnrollmentModel.deleteMany({ course: courseId });
    return { deleted: true };
  };

  // --- UPDATE COURSE ---
  const updateCourse = async (courseId, courseUpdates) => {
    const updatedCourse = await CourseModel.findByIdAndUpdate(
      courseId,
      { $set: courseUpdates },
      { new: true } // return the updated doc
    );
    return updatedCourse;
  };

  return {
    findAllCourses,
    findCoursesForEnrolledUser,
    createCourse,
    deleteCourse,
    updateCourse,
  };
}
