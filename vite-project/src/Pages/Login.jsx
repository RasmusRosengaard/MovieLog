import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../Services/firebase";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/dashboard", { replace: true });
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      if (!userCredential.user.emailVerified) {
        await auth.signOut();
        alert("Please verify your email before logging in.");
        setIsLoading(false);
        return;
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
      console.error("Login error:", err.message);
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "4rem auto",
        padding: "2rem",
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        boxShadow: "0 0 15px rgba(0,0,0,0.1)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2 style={{ marginBottom: "1.5rem", textAlign: "center", color: "#222" }}>Login</h2>

      <form onSubmit={handleSubmit}>
        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
          Email
        </label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "0.6rem",
            marginBottom: "1rem",
            borderRadius: 4,
            border: "1px solid #ccc",
            fontSize: "1rem",
            boxSizing: "border-box",
          }}
        />

        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
          Password
        </label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "0.6rem",
            marginBottom: "1.5rem",
            borderRadius: 4,
            border: "1px solid #ccc",
            fontSize: "1rem",
            boxSizing: "border-box",
          }}
        />

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "0.75rem",
            fontSize: "1.1rem",
            fontWeight: "600",
            backgroundColor: isLoading ? "#ccc" : "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: isLoading ? "not-allowed" : "pointer",
            transition: "background-color 0.3s ease",
          }}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      {error && (
        <p
          style={{
            marginTop: "1rem",
            color: "red",
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          {error}
        </p>
      )}

      <p style={{ marginTop: "1.5rem", textAlign: "center" }}>
        Don't have an account?{" "}
        <Link to="/signup" style={{ color: "#007bff", textDecoration: "none" }}>
          Sign up here
        </Link>
      </p>
    </div>
  );
};

export default Login;
