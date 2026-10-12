import mongoose from "mongoose";

const WorkSchema = new mongoose.Schema({
  title: String,
  category: String,
  image: String,
  tools: [String],
  workflow: String,
  format: String,
  commercialUse: { type: Boolean, default: false }
}, { _id: false });

const CreatorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  handle: { type: String, required: true, unique: true },
  role: String,
  location: String,
  bio: String,
  avatar: String,
  cover: String,
  specialization: String,
  contentTypes: [String],
  skills: [String],
  tools: [String],
  workflow: String,
  verifiedTools: { type: Boolean, default: false },
  verifiedWork: { type: Boolean, default: false },
  rate: Number,
  rating: Number,
  projects: Number,
  portfolio: [WorkSchema]
}, { timestamps: true });

export default mongoose.model("Creator", CreatorSchema);
