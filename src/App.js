import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import Container from "react-bootstrap/Container";
import { Route, Switch } from "react-router-dom";
import "./api/axiosDefaults";
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
import TaskCreateForm from "./pages/tasks/TaskCreateForm";
import TaskDetail from "./pages/tasks/TaskDetail";
import { useCurrentUser } from "./contexts/CurrentUserContext";
import ProfileList from "./pages/profiles/ProfileList";
import ProfileDetail from "./pages/profiles/ProfileDetail";
import ProfileEditForm from "./pages/profiles/ProfileEditForm";
import UsernameForm from "./pages/profiles/UsernameForm";
import UserPasswordForm from "./pages/profiles/UserPasswordForm";
import NotFound from "./components/NotFound";
import TaskEditForm from "./pages/tasks/TaskEditForm";
import Footer from "./components/Footer";
import Landing from "./pages/landing/Landing";
import TaskTabs from "./pages/tasks/TaskTabs";
import { ToastContainer } from "react-toastify";

function App() {
  const currentUser = useCurrentUser();

  return (
    <div className={styles.App}>
      <NavBar />
      <ToastContainer />
      <Container className={styles.Main}>
        <Switch>
          <Route
            exact
            path="/"
            render={() => (currentUser ? <TaskTabs /> : <Landing />)}
          />

          <Route exact path="/list" render={() => <TaskTabs taskList />} />

          <Route exact path="/signin" render={() => <SignInForm />} />
          <Route exact path="/signup" render={() => <SignUpForm />} />
          <Route exact path="/tasks/create" render={() => <TaskCreateForm />} />
          <Route exact path="/tasks/:id" render={() => <TaskDetail />} />
          <Route exact path="/tasks/:id/edit" render={() => <TaskEditForm />} />
          <Route
            exact
            path="/team"
            // render={() => (currentUser ? <ProfileList full /> : <SignInForm />)}
            render={() => (<ProfileList full /> )}
          />
          <Route
            exact
            path="/profiles/:id"
            render={() => (currentUser ? <ProfileDetail /> : <SignInForm />)}
          />
          <Route
            exact
            path="/profiles/:id/edit"
            render={() => <ProfileEditForm />}
          />
          <Route
            exact
            path="/profiles/:id/edit/username"
            render={() => <UsernameForm />}
          />
          <Route
            exact
            path="/profiles/:id/edit/password"
            render={() => <UserPasswordForm />}
          />
          <Route exact path="/landing" render={() => <Landing />} />
          <Route render={() => <NotFound />} />
        </Switch>
      </Container>
      <Footer />
    </div>
  );
}

export default App;
