import ModulesDao from "./dao.js";

export default function ModulesRoutes(app) {
  const dao = ModulesDao(); // no db needed

  const findModulesForCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const modules = await dao.findModulesForCourse(courseId);
      res.json(modules);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  };

  const createModuleForCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const module = { ...req.body, course: courseId };
      const newModule = await dao.createModule(module);
      res.json(newModule);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  };

  const updateModule = async (req, res) => {
    try {
      const { moduleId } = req.params;
      const updatedModule = await dao.updateModule(moduleId, req.body);
      res.json(updatedModule);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  };

  const deleteModule = async (req, res) => {
    try {
      const { moduleId } = req.params;
      const status = await dao.deleteModule(moduleId);
      res.json(status);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  };

  // --- ROUTES ---
  app.get("/api/courses/:courseId/modules", findModulesForCourse);
  app.post("/api/courses/:courseId/modules", createModuleForCourse);
  app.put("/api/modules/:moduleId", updateModule);
  app.delete("/api/modules/:moduleId", deleteModule);
}
