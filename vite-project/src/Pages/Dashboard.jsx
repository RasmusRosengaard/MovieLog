import { auth } from "../Services/firebase";
import Navbar from "../Components/Navbar";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPopularMovies } from "../Services/MovieAPI";

const Dashboard = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await fetchPopularMovies();
        setMovies(data);
      } catch (error) {
        console.error("Failed to fetch popular movies:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  return (
    <>
      <Navbar />
      <div
        style={{
          maxWidth: 1920,
          margin: "2rem auto",
          padding: "1rem 2rem",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          backgroundColor: "#f9f9f9",
          borderRadius: 8,
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ marginBottom: "0.5rem" }}>Dashboard</h2>
        <p style={{ fontSize: "1.1rem", marginBottom: "1.5rem", color: "#333" }}>
          Welcome,{" "}
          <strong style={{ color: "#007bff" }}>
            {auth.currentUser ? auth.currentUser.email : "Guest"}
          </strong>
          ! Here are some popular movies you might like.
        </p>

        <h3 style={{ marginBottom: "1rem" }}>Popular Movies</h3>
        {loading ? (
          <p>Loading movies...</p>
        ) : (
          <ul
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: "1rem",
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}
          >
            {movies.map((movie) => (
              <li
                key={movie.id}
                style={{
                  borderRadius: 8,
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                }}
              >
                <Link to={`/movies/${movie.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <img
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    alt={movie.title}
                    style={{ width: "100%", display: "block" }}
                  />
                  <p
                    style={{
                      margin: "0.5rem",
                      fontWeight: "600",
                      fontSize: "0.9rem",
                      color: "#222",
                      textAlign: "center",
                    }}
                  >
                    {movie.title}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Dashboard;
