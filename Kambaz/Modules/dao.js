import { v4 as uuidv4 } from "uuid";

export default function ModulesDao(db) {
  const modules = db.collection("modules"); // MongoDB collection

  async function updateModule(moduleId, moduleUpdates) {
    const result = await modules.findOneAndUpdate(
      { _id: moduleId },
      { $set: moduleUpdates },
      { returnDocument: "after" }
    );
    return result.value; // updated module
  }

  async function deleteModule(moduleId) {
    const result = await modules.deleteOne({ _id: moduleId });
    return result.deletedCount === 1;
  }

  async function createModule(module) {
    const newModule = { ...module, _id: uuidv4() };
    await modules.insertOne(newModule);
    return newModule;
  }

  async function findModulesForCourse(courseId) {
    return await modules.find({ course: courseId }).toArray();
  }

  return {
    findModulesForCourse,
    createModule,
    deleteModule,
    updateModule,
  };
}



