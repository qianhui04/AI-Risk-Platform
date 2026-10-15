import { useParams, Link } from "react-router-dom";
import { patients } from "../data/patients";
import { predictPatientRisk } from "../utils/riskPrediction";
import { useState } from "react";

export default function Patient() {
  const { id } = useParams();

  const patient = patients.find(
    (p) => p.id === Number(id)
  );

  if (!patient) {
    return <p>Patient not found.</p>;
  }

  const prediction = predictPatientRisk(patient);

    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);
    const [summaryError, setSummaryError] = useState("");

    async function generateSummary() {
    setLoading(true);
    setSummaryError("");
    setSummary("");

    try {
        const response = await fetch(
        "http://localhost:3001/api/patient-summary",
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            patient,
            prediction,
            }),
        }
        );

        const data = await response.json();

        if (!response.ok) {
        throw new Error(data.error || "Summary generation failed.");
        }

        setSummary(data.summary);
    } catch {
        setSummaryError(
        "Could not generate the summary. Check that the backend is running and your API key is configured."
        );
    } finally {
        setLoading(false);
    }
    }

  return (
    <div style={{ padding: "32px" }}>
      <Link to="/dashboard">← Back to Dashboard</Link>

      <h1>{patient.name}</h1>
      <p>
        {patient.age} years old · {patient.gender}
      </p>
            
        <section
        style={{
            marginTop: "24px",
            padding: "24px",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            background: "#ffffff",
        }}
        >
        <p>DEMO RISK ASSESSMENT</p>

        <h2>{prediction.level} Risk</h2>

        <h1>{prediction.score}/100</h1>

        <div
            style={{
            height: "8px",
            background: "#e2e8f0",
            borderRadius: "8px",
            overflow: "hidden",
            }}
        >
            <div
            style={{
                width: `${prediction.score}%`,
                height: "100%",
                background:
                prediction.level === "High"
                    ? "#dc4545"
                    : prediction.level === "Medium"
                    ? "#d99a24"
                    : "#159574",
            }}
            />
        </div>

        <h3>Risk Factors</h3>

        {prediction.factors.length > 0 ? (
            <ul>
            {prediction.factors.map((factor) => (
                <li key={factor.name} style={{ marginBottom: "12px" }}>
                <strong>{factor.name}</strong> (+{factor.points})
                <p>{factor.reason}</p>
                </li>
            ))}
            </ul>
        ) : (
            <p>No risk factors were identified by this demo rule.</p>
        )}

        <h3>Suggested Follow-up</h3>
        <p>{prediction.recommendation}</p>

        <p style={{ color: "#64748b", fontSize: "12px" }}>
            Illustrative score only. Not a validated clinical prediction
            and not a substitute for medical judgment.
        </p>
        </section>
                
        <section
        style={{
            marginTop: "24px",
            padding: "24px",
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
        }}
        >
        <h2>AI Patient Summary</h2>

        <p>
            Generate a draft summary from the patient's recorded
            information and demo risk assessment.
        </p>

        <button
            onClick={generateSummary}
            disabled={loading}
            style={{
            padding: "12px 18px",
            border: "none",
            borderRadius: "8px",
            background: "#0f766e",
            color: "white",
            cursor: loading ? "wait" : "pointer",
            }}
        >
            {loading ? "Generating..." : "✦ Generate AI Summary"}
        </button>

        {summaryError && (
            <p style={{ color: "#dc4545" }}>{summaryError}</p>
        )}

        {summary && (
            <div
            style={{
                marginTop: "20px",
                padding: "16px",
                background: "#f0fdfa",
                borderRadius: "8px",
                whiteSpace: "pre-wrap",
            }}
            >
            <h3>Generated Summary</h3>
            {summary}
            </div>
        )}

        <p style={{ fontSize: "12px", color: "#64748b" }}>
            AI-generated draft. A qualified clinician must verify its
            accuracy before clinical use.
        </p>
        </section>

      <hr />

      <h2>Patient Information</h2>
      <p>Blood Pressure: {patient.bloodPressure} mmHg</p>
      <p>Blood Glucose: {patient.glucose}</p>
      <p>
        Previous Admission:{" "}
        {patient.previousAdmission ? "Yes" : "No"}
      </p>

      <h2>Medical History</h2>

      {patient.conditions.length > 0 ? (
        <ul>
          {patient.conditions.map((condition) => (
            <li key={condition}>{condition}</li>
          ))}
        </ul>
      ) : (
        <p>No recorded conditions.</p>
      )}
    </div>
  );
}