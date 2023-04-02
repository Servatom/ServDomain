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
import { useEffect } from "react";

function App() {
  const loggedIn = localStorage.getItem("loggedIn");
  return (
    <Router>
      <LoginIcon />
      <Switch>
        <Route path="/login">
          {loggedIn && <Redirect to="/" />}
          {!loggedIn && <Login />}
        </Route>
        <Route path="/" exact>
          <Landing />
        </Route>
        <Route path={"/:plan"} exact>
          {!loggedIn && <Redirect to="/login" />}
          {loggedIn && <PlanPage />}
        </Route>
        <Route path={"*"}>
          <Redirect to="/" />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
