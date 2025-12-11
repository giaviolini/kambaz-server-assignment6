import { v4 as uuidv4 } from "uuid";

export default function CoursesDao(db) {
  const courses = db.collection("courses");
  const enrollments = db.collection("enrollments");

  async function findAllCourses() {
    return await courses.find({}).toArray();
  }

  async function findCoursesForEnrolledUser(userId) {
    const enrollmentDocs = await enrollments.find({ user: userId }).toArray();
    const courseIds = enrollmentDocs.map((e) => e.course);
    return await courses.find({ _id: { $in: courseIds } }).toArray();
  }

  async function createCourse(course) {
    const newCourse = { ...course, _id: uuidv4() };
    await courses.insertOne(newCourse);
    return newCourse;
  }

  async function deleteCourse(courseId) {
    await courses.deleteOne({ _id: courseId });
    await enrollments.deleteMany({ course: courseId });
    return { deleted: true };
  }

  async function updateCourse(courseId, courseUpdates) {
    const result = await courses.findOneAndUpdate(
      { _id: courseId },
      { $set: courseUpdates },
      { returnDocument: "after" }
    );
    return result.value;
  }


  return { findAllCourses,
    findCoursesForEnrolledUser,
    createCourse,
    deleteCourse,
    updateCourse,
  };
}