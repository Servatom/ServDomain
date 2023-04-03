import { signOut } from "firebase/auth";
import { useEffect } from "react";
import { Redirect, useHistory } from "react-router-dom";
import customToast from "../components/common/CustomToast";
import { auth } from "../firebase.config";

const Logout = () => {
  const history = useHistory();

  useEffect(() => {
    if (!auth.currentUser) return;

    signOut(auth)
      .then(() => {
        customToast("Logged out successfully!");
        localStorage.removeItem("user");
        history.push("/");
      })
      .catch((error) => {
        alert(error);
      });
  });

  return <Redirect to="/" />;
};

export default Logout;
