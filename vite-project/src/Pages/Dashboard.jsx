import { getAuth } from "firebase/auth";
import Navbar from "../Components/Navbar";

const Dashboard = () => {
  const auth = getAuth();
  return (
    <div>
        <Navbar />

      <h2>Dashboard</h2>
    </div>
  );
};

export default Dashboard;