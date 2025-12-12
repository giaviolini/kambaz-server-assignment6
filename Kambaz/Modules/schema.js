import mongoose from "mongoose";
const schema = new mongoose.Schema({
    _id: String,
    name: String,
    description: String,
    course: { type: String, ref: "CourseModel", required: true }, // ADD THIS
    lessons: [{ _id: String, name: String, description: String }]
}, { collection: "modules" } );
export default schema;