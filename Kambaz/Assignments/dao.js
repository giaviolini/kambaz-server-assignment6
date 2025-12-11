import { v4 as uuidv4 } from "uuid";

export default function AssignmentsDao(db) {
  const assignments = db.collection("assignments");

  async function findAssignmentsForCourse(courseId) {
    return await assignments.find({ course: courseId }).toArray();
  }

  async function createAssignment(assignment) {
    const newAssignment = { ...assignment, _id: uuidv4() };
    await assignments.insertOne(newAssignment);
    return newAssignment;
  }

  async function deleteAssignment(assignmentId) {
    await assignments.deleteOne({ _id: assignmentId });
    return { deleted: true };
  }

  async function updateAssignment(assignmentId, assignmentUpdates) {
    const result = await assignments.findOneAndUpdate(
      { _id: assignmentId },
      { $set: assignmentUpdates },
      { returnDocument: "after" }
    );
    return result.value;
  }

  return {
    findAssignmentsForCourse,
    createAssignment,
    deleteAssignment,
    updateAssignment,
  };
}
