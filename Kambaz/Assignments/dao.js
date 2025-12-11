import model from "./model.js";

export default function AssignmentsDao() {

  // Get all assignments for a course
  async function findAssignmentsForCourse(courseId) {
    return await model.find({ course: courseId }).populate("course");
  }

  // Create a new assignment for a course
  async function createAssignment(courseId, assignment) {
    const newAssignment = { ...assignment, course: courseId };
    return await model.create(newAssignment);
  }

  // Update an existing assignment
  async function updateAssignment(assignmentId, assignmentUpdates) {
    return await model.findByIdAndUpdate(
      assignmentId,
      { $set: assignmentUpdates },
      { new: true } // return the updated document
    );
  }

  // Delete an assignment
  async function deleteAssignment(assignmentId) {
    return await model.findByIdAndDelete(assignmentId);
  }

  return {
    findAssignmentsForCourse,
    createAssignment,
    updateAssignment,
    deleteAssignment,
  };
}