import { v4 as uuidv4 } from "uuid";
import AssignmentModel from "./model.js"; // Mongoose model for assignments

export default function AssignmentsDao() {

  // --- FIND ASSIGNMENTS FOR A COURSE ---
  const findAssignmentsForCourse = async (courseId) => {
    return await AssignmentModel.find({ course: courseId });
  };

  // --- CREATE ASSIGNMENT ---
  const createAssignment = async (assignment) => {
    const newAssignment = { ...assignment, _id: uuidv4() };
    return await AssignmentModel.create(newAssignment);
  };

  // --- DELETE ASSIGNMENT ---
  const deleteAssignment = async (assignmentId) => {
    await AssignmentModel.findByIdAndDelete(assignmentId);
    return { deleted: true };
  };

  // --- UPDATE ASSIGNMENT ---
  const updateAssignment = async (assignmentId, assignmentUpdates) => {
    const updatedAssignment = await AssignmentModel.findByIdAndUpdate(
      assignmentId,
      { $set: assignmentUpdates },
      { new: true } // return the updated document
    );
    return updatedAssignment;
  };

  return {
    findAssignmentsForCourse,
    createAssignment,
    deleteAssignment,
    updateAssignment,
  };
}
