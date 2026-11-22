import express from "express";
import cors from "cors";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

const products = [
  {
    id: "panel-01",
    name: "AgriWall Acoustic Panel",
    category: "Concept panel",
    description: "A proposed bio-based panel concept using processed agricultural residues.",
    image: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "panel-02",
    name: "AgriWall Interior Panel",
    category: "Potential application",
    description: "A concept for selected interior and partition applications, subject to testing.",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "panel-03",
    name: "AgriWall Sample Kit",
    category: "Prototype enquiry",
    description: "A sample enquiry concept for schools, designers and potential partners.",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85"
  }
];

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "AGRIWALL demo backend is running." });
});

app.get("/api/products", (_req, res) => {
  res.json({ products });
});

app.post("/api/orders", (req, res) => {
  const { name, email, product, message } = req.body ?? {};
  if (!name || !email || !product) {
    return res.status(400).json({ success: false, message: "Please provide your name, email and product enquiry." });
  }
  // Stage-one demo: validate and acknowledge only. Nothing is saved or purchased.
  return res.status(201).json({
    success: true,
    reference: `AGW-${Date.now().toString().slice(-6)}`,
    message: `Thank you, ${name}. Your demonstration enquiry has been received. No purchase or payment has been made.`
  });
});

app.post("/api/school-connect", (req, res) => {
  const { schoolName, contactName, email, location } = req.body ?? {};
  if (!schoolName || !contactName || !email || !location) {
    return res.status(400).json({ success: false, message: "Please complete all required fields." });
  }
  // Stage-one demo: validate and acknowledge only. Nothing is saved.
  return res.status(201).json({
    success: true,
    message: `Thank you. The School Connect demonstration form for ${schoolName} was submitted successfully.`
  });
});

app.listen(PORT, () => {
  console.log(`AGRIWALL API running at http://localhost:${PORT}`);
});
