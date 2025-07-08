import React, { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../Services/firebase";
import { useNavigate, Link } from "react-router-dom";

const CreateUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      await auth.signOut();
      alert("Account created! Please check your email to verify your account.");
      navigate("/login");
    } catch (err) {
      setError(err.message);
      console.error("Error creating user:", err.message);
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
      <h2 style={{ marginBottom: "1.5rem", textAlign: "center", color: "#222" }}>
        Create Account
      </h2>

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
          {isLoading ? "Signing up..." : "Sign Up"}
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
        Already have an account?{" "}
        <Link to="/login" style={{ color: "#007bff", textDecoration: "none" }}>
          Login here
        </Link>
      </p>
    </div>
  );
};

export default CreateUser;
