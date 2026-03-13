import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosClose } from "react-icons/io";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const menuItems = [
  { title: "Jobs",      url: "/jobs" },
  { title: "Companies", url: "/companies" },
  { title: "About Us",  url: "/about-us" },
  { title: "Contact",   url: "/contact-us" },
];

function Sidebar({ openSidebar, setOpenSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    setOpenSidebar(false);
    navigate("/");
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, height: "100%", width: "100%",
      background: "rgba(0,0,0,0.4)", zIndex: 50,
      transform: openSidebar ? "translateX(0)" : "translateX(-100%)",
      transition: "transform 0.3s ease",
    }}>
      {/* Panel */}
      <div style={{ width: "70%", background: "#fff", height: "100%", padding: 16, position: "relative" }}>
        <button onClick={() => setOpenSidebar(false)}
          style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", cursor: "pointer" }}>
          <IoIosClose size={28} />
        </button>

        <Link to="/" onClick={() => setOpenSidebar(false)}>
          <h2 style={{ fontWeight: 700, fontSize: 24, color: "var(--primary)", marginBottom: 24 }}>NextStep</h2>
        </Link>

        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 16 }}>
          {menuItems.map((item, idx) => (
            <li key={idx}>
              <Link to={item.url} onClick={() => setOpenSidebar(false)}
                style={{ fontSize: 16, fontWeight: 500 }}>
                {item.title}
              </Link>
            </li>
          ))}
        </ul>

        <div style={{ marginTop: 40, borderTop: "1px solid #e5e7eb", paddingTop: 16, display: "flex", gap: 8 }}>
          {user ? (
            <button onClick={handleLogout}
              style={{ flex: 1, fontWeight: 700, color: "#fff", background: "var(--secondary)", borderRadius: 9999, padding: "10px 0", border: "none", cursor: "pointer" }}>
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpenSidebar(false)} style={{ flex: 1 }}>
                <div style={{ textAlign: "center", fontWeight: 700, color: "var(--primary)", border: "1px solid var(--primary)", borderRadius: 9999, padding: "10px 0" }}>
                  Login
                </div>
              </Link>
              <Link to="/register" onClick={() => setOpenSidebar(false)} style={{ flex: 1 }}>
                <div style={{ textAlign: "center", fontWeight: 700, color: "#fff", background: "var(--secondary)", borderRadius: 9999, padding: "10px 0" }}>
                  Register
                </div>
              </Link>
            </>
          )}
        </div>

        <div style={{ position: "absolute", bottom: 20, color: "#6b7280", fontSize: 13 }}>
          All rights reserved © 2025
        </div>
      </div>

      {/* Backdrop click closes */}
      <div style={{ position: "absolute", top: 0, left: "70%", width: "30%", height: "100%" }}
           onClick={() => setOpenSidebar(false)} />
    </div>
  );
}

export default Sidebar;
