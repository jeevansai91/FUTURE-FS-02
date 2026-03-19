const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --- 1. DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB is now connected!"))
    .catch((err) => console.log("❌ Connection Error:", err));

// --- 2. THE LEAD MODEL ---
const LeadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    status: { type: String, default: 'New' },
    notes: { type: String, default: '' }, // This field is now ready for your updates
    createdAt: { type: Date, default: Date.now }
});

const Lead = mongoose.model('Lead', LeadSchema);

// --- 3. API ROUTES ---

app.get('/', (req, res) => {
    res.send("Server is running and DB is connected!");
});

// CREATE: Add a new lead
app.post('/api/leads', async (req, res) => {
    try {
        const { name, email } = req.body;
        const newLead = new Lead({ name, email });
        await newLead.save();
        res.status(201).json(newLead);
    } catch (error) {
        res.status(400).json({ message: "Error saving lead", error });
    }
});

// READ: Get all leads
app.get('/api/leads', async (req, res) => {
    try {
        const allLeads = await Lead.find().sort({ createdAt: -1 });
        res.json(allLeads);
    } catch (error) {
        res.status(500).json({ message: "Error fetching leads" });
    }
});

// UPDATE: Optimized to handle Status AND Notes
app.put('/api/leads/:id', async (req, res) => {
    try {
        const updatedLead = await Lead.findByIdAndUpdate(
            req.params.id, 
            req.body, // This now takes whatever fields you send (notes, status, etc.)
            { new: true }
        );
        res.json(updatedLead);
    } catch (error) {
        res.status(400).json({ message: "Error updating lead info" });
    }
});

// DELETE: Remove a lead
app.delete('/api/leads/:id', async (req, res) => {
    try {
        await Lead.findByIdAndDelete(req.params.id);
        res.json({ message: "Lead deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting lead" });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});