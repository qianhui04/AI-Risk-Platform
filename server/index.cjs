
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

app.post("/api/patient-summary", async (req, res) => {
  try {
    const { patient, prediction } = req.body;

    if (!patient || !prediction) {
      return res.status(400).json({
        error: "Patient data and prediction are required.",
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
    });

    const prompt = `
You are assisting a doctor by organizing fictional demo patient data.

Create a concise clinical-style summary with:
1. Patient overview
2. Recorded medical history and observations
3. Factors flagged by the demo risk rules
4. Items for a qualified clinician to review

Do not invent diagnoses, symptoms, test results, or medical history.
Clearly state that this is an AI-generated draft requiring clinician verification.
Do not claim that the demo score is a validated probability.

Patient:
${JSON.stringify(patient)}

Demo risk assessment:
${JSON.stringify(prediction)}
`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    res.json({ summary });
  } catch (error) {
    console.error("Summary generation failed:", error);

    res.status(500).json({
      error: "Unable to generate summary. Please try again.",
    });
  }
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`AI backend running on http://localhost:${PORT}`);
});
