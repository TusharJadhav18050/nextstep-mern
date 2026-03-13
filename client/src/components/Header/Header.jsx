import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

function Header() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const dashboardLink  = user?.role === "recruiter" ? "/recruiter-dashboard" : "/my-dashboard";
  const dashboardLabel = user?.role === "recruiter" ? "👔 Dashboard" : "👤 Dashboard";

  return (
    <div style={{ background: "#fff", padding: "12px 16px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
      <header style={{ width: "100%", maxWidth: "90%", margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>

          {/* Hamburger — only when logged in */}
          {user && (
            <>
              <Sidebar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
              <div
                className="mobile-only"
                style={{ display: "flex", alignItems: "center", color: "#9ca3af", cursor: "pointer" }}
                onClick={() => setOpenSidebar(true)}>
                <FaBars />
              </div>
            </>
          )}

          {/* Logo */}
          <div style={{ minWidth: 120 }}>
            <Link to="/">
              <h1 style={{ fontWeight: 700, fontSize: 26, color: "var(--primary)", whiteSpace: "nowrap" }}>
                NextStep
              </h1>
            </Link>
          </div>

          {/* Desktop Nav — only when logged in */}
          {user && (
            <nav className="desktop-only" style={{ display: "flex", gap: 28, alignItems: "center" }}>
              <Link to="/jobs"      style={{ fontWeight: 500, fontSize: 15 }}>Jobs</Link>
              <Link to="/companies" style={{ fontWeight: 500, fontSize: 15 }}>Companies</Link>
              <Link to={dashboardLink} style={{ fontWeight: 500, fontSize: 15, color: "var(--primary)" }}>
                {dashboardLabel}
              </Link>
              {user.role === "recruiter" && (
                <>
                  <Link to="/add-company" style={{ fontWeight: 500, fontSize: 15 }}>Add Company</Link>
                  <Link to="/add-job"     style={{ fontWeight: 500, fontSize: 15 }}>Post Job</Link>
                </>
              )}
            </nav>
          )}

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Auth Buttons — desktop */}
          <div className="desktop-only" style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {user ? (
              <>
                <Link to={dashboardLink}>
                  <div style={{
                    fontSize: 14, fontWeight: 600, color: "var(--primary)",
                    background: "#eff6ff", padding: "8px 16px", borderRadius: 8, cursor: "pointer"
                  }}>
                    {user.role === "recruiter" ? "👔" : "👤"} {user.name}
                  </div>
                </Link>
                <button onClick={handleLogout} style={{
                  fontWeight: 700, color: "#fff", background: "var(--secondary)",
                  borderRadius: 9999, padding: "8px 18px", border: "none", cursor: "pointer"
                }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <div style={{
                    fontWeight: 700, color: "var(--primary)",
                    border: "1px solid var(--primary)", borderRadius: 9999,
                    padding: "8px 18px", cursor: "pointer"
                  }}>
                    Login
                  </div>
                </Link>
                <Link to="/register">
                  <div style={{
                    fontWeight: 700, color: "#fff", background: "var(--secondary)",
                    borderRadius: 9999, padding: "8px 18px", cursor: "pointer"
                  }}>
                    Register
                  </div>
                </Link>
              </>
            )}
          </div>

          {/* Auth Buttons — mobile (guests only) */}
          {!user && (
            <div className="mobile-only" style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
              <Link to="/login">
                <div style={{
                  fontWeight: 700, color: "var(--primary)",
                  border: "1px solid var(--primary)", borderRadius: 9999,
                  padding: "6px 14px", fontSize: 13, cursor: "pointer"
                }}>Login</div>
              </Link>
              <Link to="/register">
                <div style={{
                  fontWeight: 700, color: "#fff", background: "var(--secondary)",
                  borderRadius: 9999, padding: "6px 14px", fontSize: 13, cursor: "pointer"
                }}>Register</div>
              </Link>
            </div>
          )}

        </div>
      </header>
      <style>{`
        @media (max-width: 1023px) { .desktop-only { display: none !important; } }
        @media (min-width: 1024px) { .mobile-only  { display: none !important; } }
      `}</style>
    </div>
  );
}

export default Header;