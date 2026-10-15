import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert("Unable to log out. Please try again.");
      return;
    }

    navigate("/login", { replace: true });
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <h1>Admin Panel</h1>
          <p>HealthTech Patient Management System</p>
        </div>

        <button onClick={handleLogout}>Logout</button>
      </header>

      <section className="admin-card">
        <h2>Administrator Access</h2>

        <p>
          Welcome, {user?.email}
        </p>

        <p>
          Your role: <strong>{role}</strong>
        </p>

        <p>
          You have access to administrator features.
        </p>

        <button onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
      </section>
    </main>
  );
}