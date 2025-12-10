import ModulesDao from "../Modules/dao.js";

export default function ModulesRoutes(app, db) {
  const dao = ModulesDao(db);

  const findModulesForCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const modules = await dao.findModulesForCourse(courseId);
      res.json(modules);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  const createModuleForCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const module = { ...req.body };
      const newModule = await dao.createModule(courseId, module);
      res.json(newModule);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  const deleteModule = async (req, res) => {
    try {
      const { courseId, moduleId } = req.params;
      const status = await dao.deleteModule(courseId, moduleId);
      res.json(status);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  const updateModule = async (req, res) => {
    try {
      const { courseId, moduleId } = req.params;
      const moduleUpdates = req.body;
      const updated = await dao.updateModule(courseId, moduleId, moduleUpdates);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  // ROUTES
  app.get("/api/courses/:courseId/modules", findModulesForCourse);
  app.post("/api/courses/:courseId/modules", createModuleForCourse);
  app.delete("/api/courses/:courseId/modules/:moduleId", deleteModule);
  app.put("/api/courses/:courseId/modules/:moduleId", updateModule);
}
