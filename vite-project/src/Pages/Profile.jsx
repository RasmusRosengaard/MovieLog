import { useState, useEffect } from "react";
import { updateProfile } from "firebase/auth";
import { auth } from "../Services/firebase";
import Navbar from "../Components/Navbar";

const Profile = () => {
  const user = auth.currentUser;

  const [userName, setUserName] = useState("");
  const [originalUserName, setOriginalUserName] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && user.displayName) {
      setUserName(user.displayName);
      setOriginalUserName(user.displayName);
    } else if (user) {
      // User logged in but no displayName set yet
      setUserName("");
      setOriginalUserName("");
    }
  }, [user]);

  const handleUpdateUserName = async () => {
    if (!user) {
      setMessage("No user logged in.");
      setMessageType("error");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      await updateProfile(user, {
        displayName: userName.trim() === "" ? "" : userName.trim(),
      });
      setOriginalUserName(userName.trim());
      setMessage("User name updated successfully!");
      setMessageType("success");
    } catch (error) {
      console.error("Error updating user name:", error);
      setMessage("Failed to update user name.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <div style={{ padding: "1rem", maxWidth: 600, margin: "auto", textAlign: "center" }}>
          <p>Please log in to view profile.</p>
        </div>
      </>
    );
  }

  const isSaveDisabled = isLoading || userName.trim() === originalUserName.trim();

  return (
    <>
      <Navbar />
      <div
        style={{
          padding: "2rem",
          maxWidth: 600,
          margin: "2rem auto",
          backgroundColor: "#f9f9f9",
          borderRadius: 8,
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <h1 style={{ marginBottom: "1.5rem" }}>Profile Page</h1>

        <p>
          <strong>Email:</strong> {user.email}
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!isSaveDisabled) handleUpdateUserName();
          }}
          style={{ marginTop: "1.5rem" }}
        >
          <label
            htmlFor="username"
            style={{ display: "block", fontWeight: "600", marginBottom: "0.5rem" }}
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your username (leave empty for Anonymous)"
            style={{
              width: "100%",
              padding: "0.5rem",
              fontSize: "1rem",
              borderRadius: 4,
              border: "1px solid #ccc",
              boxSizing: "border-box",
            }}
          />
          <small style={{ color: "#555", display: "block", marginTop: "0.25rem" }}>
            Leave empty to stay anonymous.
          </small>

          <button
            type="submit"
            disabled={isSaveDisabled}
            style={{
              marginTop: "1rem",
              padding: "0.6rem 1.2rem",
              fontSize: "1rem",
              fontWeight: "600",
              backgroundColor: isSaveDisabled ? "#ccc" : "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: isSaveDisabled ? "not-allowed" : "pointer",
              transition: "background-color 0.3s ease",
            }}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </form>

        {message && (
          <p
            style={{
              marginTop: "1rem",
              color: messageType === "success" ? "green" : "red",
              fontWeight: "600",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </>
  );
};

export default Profile;
