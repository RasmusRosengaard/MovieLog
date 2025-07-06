import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";


const CreateUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const auth = getAuth();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await auth.signOut();
      console.log("User created successfully!");
      navigate("/login");
    } catch (err) {
      setError(err.message);
      console.error("Error creating user:", err.message);
    }
  };

  return (
    <div className="">
      <h2 className="">Create Account</h2>
      <form className="" onSubmit={handleSubmit}>
        <input
          className=""
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className=""
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="" type="submit">
          Sign Up
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p className="">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default CreateUser;