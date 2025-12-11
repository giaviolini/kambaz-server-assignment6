import AssignmentsDao from "./dao.js";
export default function AssignmentsRoutes(app) {
  const dao = AssignmentsDao();

  // Get all assignments for a course
  const findAssignmentsForCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const assignments = await dao.findAssignmentsForCourse(courseId);
      res.json(assignments);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  };

  // Create a new assignment
  const createAssignmentForCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const assignment = req.body;
      const newAssignment = await dao.createAssignment(courseId, assignment);
      res.json(newAssignment);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  };

  // Update an assignment
  const updateAssignment = async (req, res) => {
    try {
      const { assignmentId } = req.params;
      const assignmentUpdates = req.body;
      const updatedAssignment = await dao.updateAssignment(assignmentId, assignmentUpdates);
      res.json(updatedAssignment);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  };

  // Delete an assignment
  const deleteAssignment = async (req, res) => {
    try {
      const { assignmentId } = req.params;
      const status = await dao.deleteAssignment(assignmentId);
      res.json(status);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  };

  // Routes
  app.get("/api/courses/:courseId/assignments", findAssignmentsForCourse);
  app.post("/api/courses/:courseId/assignments", createAssignmentForCourse);
  app.put("/api/assignments/:assignmentId", updateAssignment);
  app.delete("/api/assignments/:assignmentId", deleteAssignment);
}
