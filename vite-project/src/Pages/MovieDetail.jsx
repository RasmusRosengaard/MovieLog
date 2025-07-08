import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import { db, auth } from "../Services/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const API_KEY = import.meta.env.VITE_FIREBASE_TMDB_API_KEY;

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState(null);
  const [rating, setRating] = useState(1);
  const [commentText, setCommentText] = useState("");
  const [loadingComments, setLoadingComments] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadMovie = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`
        );
        setMovie(response.data);
      } catch (error) {
        console.error("Failed to fetch movie:", error);
      }
    };

    loadMovie();
  }, [id]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const commentsRef = collection(db, "comments");
      const q = query(commentsRef, where("movieId", "==", id));
      const querySnapshot = await getDocs(q);
      const loadedComments = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        loadedComments.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt ? data.createdAt.toDate() : null,
        });
      });
      setComments(loadedComments);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    if (id) fetchComments();
  }, [id]);

  const averageRating = comments.length
    ? (comments.reduce((sum, c) => sum + c.rating, 0) / comments.length).toFixed(1)
    : null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to comment");
      return;
    }
    if (!commentText.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "comments"), {
        movieId: id,
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || "Anonymous",
        rating: Number(rating),
        comment: commentText,
        createdAt: serverTimestamp(),
      });
      setCommentText("");
      setRating(1);
      await fetchComments();
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to submit comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!movie)
    return (
      <>
        <Navbar />
        <div
          style={{
            padding: "2rem",
            maxWidth: 600,
            margin: "4rem auto",
            textAlign: "center",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            color: "#555",
          }}
        >
          Loading movie details...
        </div>
      </>
    );

  return (
    <>
      <Navbar />
      <div
        style={{
          padding: "2rem",
          maxWidth: 700,
          margin: "3rem auto",
          backgroundColor: "#f9f9f9",
          borderRadius: 8,
          boxShadow: "0 0 15px rgba(0,0,0,0.1)",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          color: "#222",
        }}
      >
        <h1 style={{ marginBottom: "1rem" }}>{movie.title}</h1>
        <img
          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
          alt={movie.title}
          style={{ borderRadius: 8, display: "block", marginBottom: "1.5rem" }}
        />
        <p style={{ marginBottom: "0.75rem" }}>
          <strong>Overview:</strong> {movie.overview}
        </p>
        <p style={{ marginBottom: "0.75rem" }}>
          <strong>Release Date:</strong> {movie.release_date}
        </p>
        <p style={{ marginBottom: "0.75rem" }}>
          <strong>TMDB Rating:</strong> {movie.vote_average} / 10
        </p>
        {averageRating ? (
          <p style={{ marginBottom: "1.5rem" }}>
            <strong>MovieLog Rating:</strong> {averageRating} / 5 (
            {comments.length} {comments.length === 1 ? "review" : "reviews"})
          </p>
        ) : (
          <p style={{ marginBottom: "1.5rem" }}>No ratings yet.</p>
        )}

        <hr style={{ marginBottom: "1.5rem" }} />

        <h2 style={{ marginBottom: "1rem" }}>Comments & Ratings</h2>

        {loadingComments ? (
          <p>Loading comments...</p>
        ) : comments.length > 0 ? (
          comments.map((c) => (
            <div
              key={c.id}
              style={{
                marginBottom: "1.25rem",
                borderBottom: "1px solid #ddd",
                paddingBottom: "0.75rem",
              }}
            >
              <strong style={{ color: "#007bff" }}>{c.userName}</strong> rated{" "}
              <span style={{ color: "#ffb400" }}>{c.rating}/5 ⭐</span>
              <p style={{ margin: "0.3rem 0 0.5rem 0" }}>{c.comment}</p>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "#666",
                  marginTop: "0.25rem",
                }}
              >
                <strong>Created at:</strong>{" "}
                {c.createdAt
                  ? c.createdAt.toLocaleDateString()
                  : "Unknown"}{" "}
                -{" "}
                {c.createdAt
                  ? c.createdAt.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Unknown"}
              </p>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}

        {user ? (
          <form onSubmit={handleSubmit} style={{ marginTop: "2rem" }}>
            <h3 style={{ marginBottom: "1rem" }}>
              Add rating for <span style={{ color: "#007bff" }}>{movie.title}</span>
            </h3>

            <label
              htmlFor="rating"
              style={{ fontWeight: "600", display: "block", marginBottom: "0.5rem" }}
            >
              Rating (1 = worst, 5 = best):
            </label>
            <select
              id="rating"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              style={{
                padding: "0.5rem",
                fontSize: "1rem",
                borderRadius: 4,
                border: "1px solid #ccc",
                marginBottom: "1rem",
                width: "100px",
              }}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>

            <label
              htmlFor="comment"
              style={{ fontWeight: "600", display: "block", marginBottom: "0.5rem" }}
            >
              Comment:
            </label>
            <textarea
              id="comment"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={4}
              placeholder="What did you think about this movie?"
              style={{
                width: "100%",
                padding: "0.75rem",
                fontSize: "1rem",
                borderRadius: 6,
                border: "1px solid #ccc",
                resize: "vertical",
                marginBottom: "1rem",
                boxSizing: "border-box",
              }}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: "0.75rem 1.5rem",
                fontSize: "1rem",
                fontWeight: "600",
                color: "#fff",
                backgroundColor: isSubmitting ? "#ccc" : "#007bff",
                border: "none",
                borderRadius: 6,
                cursor: isSubmitting ? "not-allowed" : "pointer",
                transition: "background-color 0.3s ease",
                display: "block",
              }}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        ) : (
          <p style={{ marginTop: "2rem" }}>Please log in to add a comment.</p>
        )}
      </div>
    </>
  );
};

export default MovieDetail;
