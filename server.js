import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Creator from "./models/Creator.js";
import Brief from "./models/Brief.js";
import { sampleCreators } from "./data/sampleCreators.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

let memoryCreators = structuredClone(sampleCreators);
let memoryBriefs = [];
let mongoReady = false;

const clean = (value) => String(value || "").trim().toLowerCase();

app.get("/api/health", (_req, res) => res.json({ ok: true, database: mongoReady ? "mongodb" : "memory-demo" }));

app.get("/api/creators", async (req, res) => {
  try {
    const { q = "", specialization = "", contentType = "", tool = "" } = req.query;
    if (mongoReady) {
      const filter = {};
      if (specialization) filter.specialization = specialization;
      if (contentType) filter.contentTypes = contentType;
      if (tool) filter.tools = tool;
      let rows = await Creator.find(filter).lean();
      const term = clean(q);
      if (term) rows = rows.filter(c => [c.name, c.role, c.bio, c.specialization, ...(c.skills || []), ...(c.tools || []), ...(c.contentTypes || [])].some(v => clean(v).includes(term)));
      return res.json(rows);
    }
    const term = clean(q);
    const rows = memoryCreators.filter(c => {
      const matchesText = !term || [c.name, c.role, c.bio, c.specialization, ...(c.skills || []), ...(c.tools || []), ...(c.contentTypes || [])].some(v => clean(v).includes(term));
      return matchesText && (!specialization || c.specialization === specialization) && (!contentType || c.contentTypes.includes(contentType)) && (!tool || c.tools.includes(tool));
    });
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Could not load creators", error: error.message });
  }
});

app.get("/api/creators/:id", async (req, res) => {
  try {
    const creator = mongoReady
      ? await Creator.findById(req.params.id).lean()
      : memoryCreators.find(c => c.id === req.params.id || c.handle === req.params.id);
    if (!creator) return res.status(404).json({ message: "Creator not found" });
    res.json(creator);
  } catch (error) {
    res.status(400).json({ message: "Invalid creator ID", error: error.message });
  }
});

app.get("/api/briefs", async (_req, res) => {
  try {
    const rows = mongoReady ? await Brief.find().sort({ createdAt: -1 }).lean() : memoryBriefs;
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Could not load briefs", error: error.message });
  }
});

app.post("/api/briefs", async (req, res) => {
  const { campaignName, brandName, description, contentType, style, aspectRatio } = req.body;
  if (![campaignName, brandName, description, contentType, style, aspectRatio].every(v => String(v || "").trim())) {
    return res.status(400).json({ message: "Please complete all required brief fields." });
  }
  try {
    const payload = {
      campaignName: campaignName.trim(), brandName: brandName.trim(), description: description.trim(),
      contentType, style, aspectRatio, budget: Math.max(0, Number(req.body.budget) || 0),
      deadline: req.body.deadline || "", commercialUse: Boolean(req.body.commercialUse),
      usageDuration: req.body.usageDuration || "12 months", revisions: Math.max(0, Number(req.body.revisions) || 0),
      status: "Open"
    };
    const saved = mongoReady ? await Brief.create(payload) : { ...payload, _id: `brief-${Date.now()}`, createdAt: new Date().toISOString() };
    if (!mongoReady) memoryBriefs.unshift(saved);
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: "Could not create brief", error: error.message });
  }
});

app.post("/api/briefs/assist", (req, res) => {
  const idea = String(req.body.idea || "").trim();
  if (idea.length < 8) return res.status(400).json({ message: "Describe your idea in at least 8 characters." });
  const lower = idea.toLowerCase();
  const contentType = /video|film|reel|motion|animate/.test(lower) ? "Video" : /3d|render|product/.test(lower) ? "Product Ads" : "Images";
  const style = /luxury|premium|elegant/.test(lower) ? "Premium editorial" : /playful|fun|colorful/.test(lower) ? "Playful and bold" : "Cinematic, contemporary";
  res.json({
    campaignName: "Creative campaign concept",
    description: `${idea}\n\nDeliverables: 3 creative directions and 2 revision rounds. Please include your AI tools, workflow, and commercial-use assumptions.`,
    contentType, style, aspectRatio: contentType === "Video" ? "9:16" : "1:1",
    commercialUse: true, usageDuration: "12 months", revisions: 2,
    note: "Demo assistant uses rules and templates. Connect an LLM API for true generative assistance."
  });
});

app.patch("/api/briefs/:id/status", async (req, res) => {
  const allowed = ["Open", "In Progress", "In Review", "Delivered"];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ message: "Invalid status" });
  try {
    if (mongoReady) {
      const updated = await Brief.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }).lean();
      if (!updated) return res.status(404).json({ message: "Brief not found" });
      return res.json(updated);
    }
    const brief = memoryBriefs.find(b => b._id === req.params.id);
    if (!brief) return res.status(404).json({ message: "Brief not found" });
    brief.status = req.body.status;
    res.json(brief);
  } catch (error) {
    res.status(400).json({ message: "Could not update status", error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
if (process.env.MONGODB_URI) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    mongoReady = true;
    const count = await Creator.countDocuments();
    if (!count) await Creator.insertMany(sampleCreators.map(({ id, ...creator }) => creator));
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection failed; continuing with demo memory data:", error.message);
  }
}
app.listen(PORT, () => console.log(`Kampus.VC API running at http://localhost:${PORT}`));
