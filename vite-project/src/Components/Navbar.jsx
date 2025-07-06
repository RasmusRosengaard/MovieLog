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
    <header
      style={{
        width: "100%",
        backgroundColor: "#121212",
        color: "#fff",
        borderBottom: "3px solid #e50914",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.6)",
        fontFamily: "sans-serif",
      }}
    >
      <nav
        style={{
          maxWidth: "1920px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          padding: "1rem 2rem",
        }}
      >
        {/* Left: Brand Icon */}
        <div style={{ marginRight: "1rem" }}>
          <Link
            
            style={{
              textDecoration: "none",
              color: "#e50914",
              fontWeight: "bold",
              fontSize: "2rem",
              letterSpacing: "2px",
            }}
          >
            🎬 MovieLog
          </Link>
        </div>

            {/* Middle: Navigation Links */}
        <div
        style={{
            display: "flex",
            gap: "1rem",
            flex: 1,
            justifyContent: "center",
        }}
        >
        {[
            { to: "/dashboard", label: "Dashboard" },
            { to: "/profile", label: "Profile" },
        ].map((link) => (
            <Link
            key={link.to}
            to={link.to}
            style={{
                textDecoration: "none",
                color: "#fff",
                backgroundColor: "#1f1f1f",
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                border: "1px solid #333",
                fontSize: "1.2rem",
                fontWeight: "bold",
                boxShadow: "0 0 4px rgba(0,0,0,0.5)",
                transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
                e.target.style.backgroundColor = "#e50914";
                e.target.style.color = "#fff";
                e.target.style.boxShadow = "0 0 8px #e50914";
            }}
            onMouseOut={(e) => {
                e.target.style.backgroundColor = "#1f1f1f";
                e.target.style.color = "#fff";
                e.target.style.boxShadow = "0 0 4px rgb(224, 224, 224)";
            }}
            >
            {link.label}
            </Link>
        ))}
        </div>


        {/* Right: Logout Button */}
        <div>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#e50914",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              padding: "0.5rem 1rem",
              fontSize: "1.2rem",
              fontWeight: "bold",
              cursor: "pointer",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#b00610")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#e50914")}
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
