import { getAuth } from "firebase/auth";
import Navbar from "../Components/Navbar";
import { useEffect } from "react";

  
const Dashboard = () => {
  const auth = getAuth();
  return (
    <div>
        <Navbar />

      <h2>Dashboard</h2>
      <p>The purpose of this website, will be to review movies/series.
        <br />
        Other users can see your reviews, and each movie will have their own rating with stars & comments.
        <br />
        Later on, i will add a viewlist, where you can add movies/series you want to watch.'
        <br />
        Ideal is to integrate with streaming services, so the procces is automatic.
      </p>
    </div>
  );
};

export default Dashboard;