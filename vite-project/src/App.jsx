import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import CreateUser from './Pages/CreateUser.jsx'
import Login from './Pages/Login.jsx'
import { getAuth, onAuthStateChanged, ProviderId } from 'firebase/auth'
import Dashboard from './Pages/Dashboard.jsx';
import Profile from './Pages/Profile.jsx';
import "./Services/firebase";


function PrivateRoute({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log("Auth state changed:", firebaseUser);
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  if (user === undefined) return <div>Loading...</div>;

  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<CreateUser />} />
        <Route path="*" element={<Navigate to="/login" />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard/>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile/>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
