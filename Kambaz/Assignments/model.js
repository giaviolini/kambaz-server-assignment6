import mongoose from "mongoose";

const schema = new mongoose.Schema({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  course: { type: String, ref: "CourseModel", required: true },
  dueDate: { type: Date },
});

const model = mongoose.model("AssignmentModel", schema);
export default model;