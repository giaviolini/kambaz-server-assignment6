import AssignmentsDao from "../Assignments/dao.js";

export default function AssignmentsRoutes(app) {
  const dao = AssignmentsDao();

  // --- GET ASSIGNMENTS FOR A COURSE ---
  const findAssignmentsForCourse = async (req, res) => {
    const { courseId } = req.params;
    try {
      const assignments = await dao.findAssignmentsForCourse(courseId);
      res.json(assignments);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  };

  // --- CREATE ASSIGNMENT ---
  const createAssignmentForCourse = async (req, res) => {
    const { courseId } = req.params;
    const assignment = {
      ...req.body,
      course: courseId,
    };
    try {
      const newAssignment = await dao.createAssignment(assignment);
      res.json(newAssignment);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  };

  // --- DELETE ASSIGNMENT ---
  const deleteAssignment = async (req, res) => {
    const { assignmentId } = req.params;
    try {
      const status = await dao.deleteAssignment(assignmentId);
      res.json(status);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  };

  // --- UPDATE ASSIGNMENT ---
  const updateAssignment = async (req, res) => {
    const { assignmentId } = req.params;
    const assignmentUpdates = req.body;
    try {
      const updatedAssignment = await dao.updateAssignment(
        assignmentId,
        assignmentUpdates
      );
      res.json(updatedAssignment);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  };

  app.get("/api/courses/:courseId/assignments", findAssignmentsForCourse);
  app.post("/api/courses/:courseId/assignments", createAssignmentForCourse);
  app.put("/api/assignments/:assignmentId", updateAssignment);
  app.delete("/api/assignments/:assignmentId", deleteAssignment);
}

