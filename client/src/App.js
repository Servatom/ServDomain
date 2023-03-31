import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import LoginIcon from "./components/LoginIcon";
import Landing from "./pages/Landing";
import PlanPage from "./pages/Plan";

function App() {
  return (
    <Router>
      <LoginIcon />
      <Switch>
        <Route path="/" exact>
          <Landing />
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
