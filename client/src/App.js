import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import LoginIcon from "./components/LoginIcon";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import PlanPage from "./pages/Plan";
import { auth } from "./firebase.config";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import TermsAndConditions from "./pages/TnC";
import Profile from "./pages/Profile";
import Logout from "./pages/Logout";

function App() {
  useEffect(() => {
    // retrieve user from local storage
    const user = JSON.parse(localStorage.getItem("user"));
    user && auth.updateCurrentUser(user);
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
