
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { patients } from "../data/patients";
import "../index.css";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const [search, setSearch] = useState("");

  const high = patients.filter(
    (p) => p.riskLevel === "High"
  ).length;

  const medium = patients.filter(
    (p) => p.riskLevel === "Medium"
  ).length;

  const low = patients.filter(
    (p) => p.riskLevel === "Low"
  ).length;

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const navigate = useNavigate();

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert("Unable to log out. Please try again.");
      return;
    }

    navigate("/login", { replace: true });
  }

  const { user, role } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h2 className="brand">✚ HealthAI</h2>
        <p>
          Signed in as: {user?.email} ({role ?? "No role assigned"})
        </p>

        <p className="nav-label">WORKSPACE</p>
        <div className="nav-item active">▦ Dashboard</div>
        <div className="nav-item">♙ Patients</div>
        <div className="nav-item">♡ Risk Monitoring</div>

        <div className="sidebar-bottom">
          <div className="avatar">DR</div>
          <div>
            <strong>Dr. Lim</strong>
            <p>Doctor</p>
          </div>
        </div>
        <button onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">HEALTHCARE MONITORING</p>
            <h1>Patient Dashboard</h1>
            <p className="muted">
              Monitor patient risk and review patient records.
            </p>
          </div>
          <span className="role-badge">Doctor Portal</span>
        </header>

        <section className="stats-grid">
          <div className="stat-card">
            <p>Total Patients</p>
            <h2>{patients.length}</h2>
            <span>Registered patients</span>
          </div>

          <div className="stat-card">
            <p>High Risk</p>
            <h2 className="risk-high">{high}</h2>
            <span>Requires review</span>
          </div>

          <div className="stat-card">
            <p>Medium Risk</p>
            <h2 className="risk-medium">{medium}</h2>
            <span>Monitor closely</span>
          </div>

          <div className="stat-card">
            <p>Low Risk</p>
            <h2 className="risk-low">{low}</h2>
            <span>Routine monitoring</span>
          </div>
        </section>

        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Patient Records</h2>
              <p className="muted">
                Review risk levels and patient information.
              </p>
            </div>

            <input
              className="search-input"
              placeholder="Search patient..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Age</th>
                  <th>Conditions</th>
                  <th>Risk Score</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id}>
                    <td>
                      <strong>{patient.name}</strong>
                      <p className="muted">
                        ID: PT-{String(patient.id).padStart(3, "0")}
                      </p>
                    </td>

                    <td>{patient.age}</td>

                    <td>
                      {patient.conditions.length
                        ? patient.conditions.join(", ")
                        : "None recorded"}
                    </td>

                    <td>
                      <strong>{patient.riskScore}%</strong>
                    </td>

                    <td>
                      <span
                        className={`risk-badge ${patient.riskLevel.toLowerCase()}`}
                      >
                        {patient.riskLevel}
                      </span>
                    </td>

                    <td>
                      <Link
                        className="view-link"
                        to={`/patient/${patient.id}`}
                      >
                        View details →
                      </Link>
                    </td>
                  </tr>
                ))}

                {filteredPatients.length === 0 && (
                  <tr>
                    <td colSpan={6}>No patients found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="disclaimer">
            Demo data only. Risk scores are illustrative and are not
            clinically validated.
          </p>
        </section>
      </main>
    </div>
  );
}
