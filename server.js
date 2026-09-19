const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });

const formSchema = new mongoose.Schema({
    name: String,
    mobile: String,
    email: String,
    remarks: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const FormData = mongoose.model("FormData", formSchema, "wsdata");

app.get("/", (req, res) => {
    res.send("WS Form Backend is running");
});

app.post("/submit", async (req, res) => {
    try {
        const newForm = new FormData(req.body);

        await newForm.save();

        res.json({
            success: true,
            message: "Form submitted successfully"
        });
    } catch (error) {
        console.error("Form submission error:", error);

        res.status(500).json({
            success: false,
            message: "Error saving form"
        });
    }
});

app.get("/data", async (req, res) => {
    try {
        const data = await FormData.find().sort({ createdAt: -1 });

        res.json(data);
    } catch (error) {
        console.error("Error fetching data:", error);

        res.status(500).json({
            success: false,
            message: "Error fetching data"
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
