import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import Container from "react-bootstrap/Container";
import { Route, Switch } from "react-router-dom";
import "./api/axiosDefaults";
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
import TaskCreateForm from "./pages/tasks/TaskCreateForm";
import TaskDetail from "./pages/tasks/TaskDetail";
import TaskList from "./pages/tasks/TaskList";
import { useCurrentUser } from "./contexts/CurrentUserContext";

function App() {
  const currentUser = useCurrentUser();
  const profile_id = currentUser?.profile_id || "";

  return (
    <div className={styles.App}>
      <NavBar />
      <Container className={styles.Main}>
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <TaskList message="No results found. Adjust the search keyword." />
            )}
          />
          <Route
            exact
            path="/watched"
            render={() => (
              <TaskList
                message="No results found. Adjust the search keyword or watch a task."
                filter={`/tasks/?watched__owner__profile=${profile_id}&ordering=-watchers__created_at&`}
              />
            )}
          />
          <Route
            exact
            path="/assigned"
            render={() => (
              <TaskList
                message="No results found. Adjust the search keyword assign a task to yourself."
                filter={`/tasks/?assignee__profile=${profile_id}&ordering=-updated_at&`}
              />
            )}
          />
          <Route exact path="/signin" render={() => <SignInForm />} />
          <Route exact path="/signup" render={() => <SignUpForm />} />
          <Route exact path="/tasks/create" render={() => <TaskCreateForm />} />
          <Route exact path="/tasks/:id" render={() => <TaskDetail />} />
          <Route render={() => <h1>Oops! Page not found</h1>} />
        </Switch>
      </Container>
    </div>
  );
}

export default App;
