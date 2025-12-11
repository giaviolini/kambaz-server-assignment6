import { v4 as uuidv4 } from "uuid";
import ModulesModel from "./model.js"; // your Mongoose model

export default function ModulesDao() {

  // --- CREATE MODULE ---
  const createModule = async (module) => {
    const newModule = { ...module, _id: uuidv4() };
    return await ModulesModel.create(newModule);
  };

  // --- FIND MODULES FOR A COURSE ---
  const findModulesForCourse = async (courseId) => {
    return await ModulesModel.find({ course: courseId });
  };

  // --- UPDATE MODULE ---
  const updateModule = async (moduleId, moduleUpdates) => {
    return await ModulesModel.findByIdAndUpdate(
      moduleId,
      moduleUpdates,
      { new: true } // return updated module
    );
  };

  // --- DELETE MODULE ---
  const deleteModule = async (moduleId) => {
    const result = await ModulesModel.findByIdAndDelete(moduleId);
    return !!result; // true if deleted, false otherwise
  };

  return {
    createModule,
    findModulesForCourse,
    updateModule,
    deleteModule,
  };
}




