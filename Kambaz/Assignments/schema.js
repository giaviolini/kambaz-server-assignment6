import mongoose from "mongoose";

const schema = new mongoose.Schema({
  _id: { type: String, required: true },           // unique ID for the assignment
  title: { type: String, required: true },         // assignment title
  description: { type: String },                   // optional description
  course: { type: String, ref: "CourseModel", required: true }, // reference to course
  dueDate: { type: Date },                         // optional due date
}, {
  timestamps: true // automatically add createdAt and updatedAt
}, { collection: "assignments" } );

export default schema;