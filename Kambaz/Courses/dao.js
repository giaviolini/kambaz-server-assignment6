import { v4 as uuidv4 } from "uuid";
import CourseModel from "./model.js";
import EnrollmentModel from "../Enrollments/model.js";

export default function CoursesDao() {

  // Get all courses
  async function findAllCourses() {
    return CourseModel.find({}, { name: 1, description: 1 });
  }

  // Find courses for a specific user
  async function findCoursesForEnrolledUser(userId) {
    // 1. Find all enrollments for this user
    const enrollments = await EnrollmentModel.find({ user: userId });

    // 2. Extract course IDs
    const courseIds = enrollments.map((e) => e.course);

    // 3. Find all matching courses
    return CourseModel.find(
      { _id: { $in: courseIds } },
      { name: 1, description: 1 }
    );
  }

  // Create a new course
  async function createCourse(course) {
    const newCourse = { ...course, _id: uuidv4() };
    return CourseModel.create(newCourse);
  }

  // Delete a course
  async function deleteCourse(courseId) {
    return CourseModel.deleteOne({ _id: courseId });
  }

  // Update a course
  async function updateCourse(courseId, courseUpdates) {
    return CourseModel.updateOne({ _id: courseId }, { $set: courseUpdates });
  }

  return {
    findAllCourses,
    findCoursesForEnrolledUser,
    createCourse,
    deleteCourse,
    updateCourse
  };
}
  
