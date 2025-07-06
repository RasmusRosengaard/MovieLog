import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    navigate("/login");
  };

  return (
    <header style={{ width: "100%", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
      <nav
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem 2rem",
          background: "#fff",
        }}
      >
        <Link
          to="/dashboard"
          style={{
            textDecoration: "none",
            color: "#333",
            fontWeight: "bold",
            fontSize: "1.2rem",
            letterSpacing: "1px",
          }}
        >
          Dashboard
        </Link>
        <Link
          to="/profile"
          style={{
            textDecoration: "none",
            color: "#333",
            fontWeight: "bold",
            fontSize: "1.2rem",
            letterSpacing: "1px",
          }}
        >
          Profile
        </Link>
        <button
          onClick={handleLogout}
          style={{
            background: "#ff5252",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "0.5rem 1.2rem",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "1rem",
            transition: "background 0.2s",
          }}
        >
          Logout
        </button>
      </nav>
      <div style={{ width: "100%", height: "3px", background: "#1976d2" }} />
    </header>
  );
};

export default Navbar;