export type Patient = {
    id: number;
    name: string;
    age: number;
    gender: string;
    riskScore: number;
    riskLevel: "High" | "Medium" | "Low";
    conditions: string[];
    bloodPressure: string;
    glucose: string;
    previousAdmission: boolean;
  };
  
  export const patients: Patient[] = [
    {
      id: 1,
      name: "John Tan",
      age: 67,
      gender: "Male",
      riskScore: 82,
      riskLevel: "High",
      conditions: ["Hypertension", "Diabetes"],
      bloodPressure: "165/95",
      glucose: "185 mg/dL",
      previousAdmission: true,
    },
    {
      id: 2,
      name: "Sarah Lim",
      age: 45,
      gender: "Female",
      riskScore: 54,
      riskLevel: "Medium",
      conditions: ["Hypertension"],
      bloodPressure: "145/88",
      glucose: "125 mg/dL",
      previousAdmission: false,
    },
    {
      id: 3,
      name: "Adam Lee",
      age: 29,
      gender: "Male",
      riskScore: 18,
      riskLevel: "Low",
      conditions: [],
      bloodPressure: "120/78",
      glucose: "95 mg/dL",
      previousAdmission: false,
    },
    {
      id: 4,
      name: "Emily Wong",
      age: 72,
      gender: "Female",
      riskScore: 76,
      riskLevel: "High",
      conditions: ["Diabetes", "Heart Disease"],
      bloodPressure: "158/92",
      glucose: "210 mg/dL",
      previousAdmission: true,
    },
  ];