// src/Services/MovieAPI.js
import axios from 'axios';

const API_KEY = import.meta.env.VITE_FIREBASE_TMDB_API_KEY; // or hardcode for testing
const BASE_URL = 'https://api.themoviedb.org/3';

export const fetchPopularMovies = async (totalPages = 5) => {
  try {
    let allMovies = [];

    for (let page = 1; page <= totalPages; page++) {
      const response = await axios.get(`${BASE_URL}/movie/popular`, {
        params: {
          api_key: API_KEY,
          language: 'en-US',
          page,
        },
      });
      allMovies = allMovies.concat(response.data.results);
    }

    // Remove duplicates by movie.id
    const uniqueMoviesMap = new Map();
    allMovies.forEach(movie => {
      uniqueMoviesMap.set(movie.id, movie);
    });

    const uniqueMovies = Array.from(uniqueMoviesMap.values());

    return uniqueMovies;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
};

