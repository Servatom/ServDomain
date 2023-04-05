import { useContext, useEffect } from "react";
import { Redirect } from "react-router-dom";
import AuthContext from "../store/auth-context";

const Logout = () => {
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    if (!authCtx.isLoggedIn) return;

    authCtx.logout();
  }, []);

  return <Redirect to="/" />;
};

export default Logout;
