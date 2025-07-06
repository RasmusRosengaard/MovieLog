import { getAuth } from "firebase/auth";
import Navbar from "../Components/Navbar";


const Profile = () => {
  const auth = getAuth();


  const user = auth.currentUser;

  return (
    <div>
        <Navbar />
      <h1>Profile page </h1>
        <div>
            <p>Email: {user ? user.email : "No user logged in"}</p>
            </div>
    </div>
  );
};

export default Profile;