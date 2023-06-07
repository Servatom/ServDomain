import { signOut } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase.config";
import customToast from "../components/common/CustomToast";

const AuthContext = React.createContext({
  user: {
    phoneNumber: "",
    firebaseUID: "",
    userID: "",
    token: "",
  },
  isLoggedIn: false,
  login: (user) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const initialUser = localStorage.getItem("user");

  const [user, setUser] = useState(
    !!initialUser ? JSON.parse(initialUser) : null
  );

  const userIsLoggedIn = !!user;
  const loginHandler = (user) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const logoutHandler = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        localStorage.removeItem("user");
        customToast("Logged out successfully!", "logout");
      })
      .catch((error) => {
        alert(error);
      });
  };

  const contextValue = {
    user: user,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
