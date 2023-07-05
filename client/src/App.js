import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useHistory,
} from "react-router-dom";
import LoginIcon from "./components/LoginIcon";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import PlanPage from "./pages/Plan";
import { useContext, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import TermsAndConditions from "./pages/TnC";
import Profile from "./pages/Profile";
import Logout from "./pages/Logout";
import AuthContext from "./store/auth-context";
import axios from "./axios";
import customToast from "./components/common/CustomToast";
import Support from "./pages/Support";

function App() {
  const authCtx = useContext(AuthContext);
  const history = useHistory();

  useEffect(() => {
    if (authCtx.isLoggedIn) {
      axios
        .post(
          "/user/verify",
          {},
          {
            headers: {
              Authorization: `Bearer ${authCtx.user.token}`,
            },
          }
        )
        .then((res) => {
          if (res.status !== 200) {
            history.push("/logout");
            customToast("Session expired. Please login again.");
          }
        })
        .catch((err) => {
          console.error(err);
          history.push("/logout");
          customToast("Session expired. Please login again.");
        });
    }
  }, []);

  return (
    <Router>
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 3000,
        }}
      />
      <LoginIcon />
      <Switch>
        <Route path="/" exact>
          <Landing />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/logout">
          <Logout />
        </Route>
        <Route path={"/profile"}>
          <Profile />
        </Route>
        <Route path={"/tnc"}>
          <TermsAndConditions />
        </Route>
        <Route path={"/support"}>
          <Support />
        </Route>
        <Route path={"/:plan"} exact>
          <PlanPage />
        </Route>
        <Route path={"*"}>
          <Redirect to="/" />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
