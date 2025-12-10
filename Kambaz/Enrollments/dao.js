import model from "./model.js";

export default function EnrollmentsDao(db) {

  // FIND COURSES A USER IS ENROLLED IN
  async function findCoursesForUser(userId) {
    const enrollments = await model
      .find({ user: userId })
      .populate("course");
    return enrollments.map((e) => e.course);
  }

  // FIND USERS ENROLLED IN A COURSE
  async function findUsersForCourse(courseId) {
    const enrollments = await model
      .find({ course: courseId })
      .populate("user");
    return enrollments.map((e) => e.user);
  }

  // ENROLL A USER IN A COURSE
  async function enrollUserInCourse(userId, courseId) {
    // Avoid duplicate enrollment
    const exists = await model.findOne({ user: userId, course: courseId });
    if (exists) return exists;

    return model.create({
      user: userId,
      course: courseId,
    });
  }

  // UNENROLL SPECIFIC USER FROM COURSE
  async function unenrollUserFromCourse(userId, courseId) {
    return model.deleteOne({ user: userId, course: courseId });
  }

  // UNENROLL ALL USERS (USED WHEN COURSE IS DELETED)
  async function unenrollAllUsersFromCourse(courseId) {
    return model.deleteMany({ course: courseId });
  }

  return {
    findCoursesForUser,
    findUsersForCourse,
    enrollUserInCourse,
    unenrollUserFromCourse,
    unenrollAllUsersFromCourse,
  };
}
