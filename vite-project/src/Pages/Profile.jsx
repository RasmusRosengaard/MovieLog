import { getAuth } from "firebase/auth";
import Navbar from "../Components/Navbar";


const Profile = () => {
  const auth = getAuth();


  const user = auth.currentUser;

  return (
    <div>
        <Navbar />
      <h2>Profile page </h2>
        <div>
            <h3>Email: {user ? user.email : "No user logged in"}</h3>
            </div>
    </div>
  );
};

export default Profile;