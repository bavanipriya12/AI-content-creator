import mongoose from "mongoose";

const BriefSchema = new mongoose.Schema({
  campaignName: { type: String, required: true, trim: true },
  brandName: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  contentType: { type: String, required: true },
  style: { type: String, required: true },
  aspectRatio: { type: String, required: true },
  budget: { type: Number, min: 0, default: 0 },
  deadline: String,
  commercialUse: { type: Boolean, default: false },
  usageDuration: String,
  revisions: { type: Number, min: 0, default: 2 },
  status: { type: String, default: "Open" }
}, { timestamps: true });

export default mongoose.model("Brief", BriefSchema);
