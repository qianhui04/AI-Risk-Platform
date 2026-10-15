
import type { Patient } from "../data/patients";

export type RiskFactor = {
  name: string;
  points: number;
  reason: string;
};

export type RiskPrediction = {
  score: number;
  level: "High" | "Medium" | "Low";
  factors: RiskFactor[];
  recommendation: string;
};

export function predictPatientRisk(
  patient: Patient
): RiskPrediction {
  const factors: RiskFactor[] = [];

  // 1. Age
  if (patient.age >= 60) {
    factors.push({
      name: "Older age",
      points: 20,
      reason: `Patient is ${patient.age} years old.`,
    });
  }

  // 2. Systolic blood pressure
  const systolicBP = Number(
    patient.bloodPressure.split("/")[0]
  );

  if (systolicBP >= 160) {
    factors.push({
      name: "Very high systolic blood pressure",
      points: 25,
      reason: `Recorded systolic pressure: ${systolicBP} mmHg.`,
    });
  } else if (systolicBP >= 140) {
    factors.push({
      name: "High systolic blood pressure",
      points: 15,
      reason: `Recorded systolic pressure: ${systolicBP} mmHg.`,
    });
  }

  // 3. Blood glucose
  const glucose = Number.parseFloat(patient.glucose);

  if (glucose >= 180) {
    factors.push({
      name: "Elevated blood glucose",
      points: 20,
      reason: `Recorded glucose: ${patient.glucose}.`,
    });
  } else if (glucose >= 126) {
    factors.push({
      name: "High blood glucose",
      points: 10,
      reason: `Recorded glucose: ${patient.glucose}.`,
    });
  }

  // 4. Medical history
  if (
    patient.conditions.some(
      (condition) => condition.toLowerCase() === "diabetes"
    )
  ) {
    factors.push({
      name: "Diabetes history",
      points: 15,
      reason: "Diabetes is listed in the demo medical history.",
    });
  }

  if (patient.previousAdmission) {
    factors.push({
      name: "Previous hospital admission",
      points: 10,
      reason: "A previous admission is recorded.",
    });
  }

  // Demo score capped at 100
  const score = Math.min(
    100,
    factors.reduce((total, factor) => total + factor.points, 0)
  );

  const level: RiskPrediction["level"] =
    score >= 60 ? "High" :
    score >= 30 ? "Medium" :
    "Low";

  const recommendation =
    level === "High"
      ? "Prioritize clinical review and verify the latest observations."
      : level === "Medium"
      ? "Review relevant observations and continue appropriate monitoring."
      : "Continue routine monitoring according to the clinical care plan.";

  return {
    score,
    level,
    factors,
    recommendation,
  };
}
