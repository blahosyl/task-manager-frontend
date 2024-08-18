import { Route, Switch } from "react-router-dom";

// notification messages
import { ToastContainer } from "react-toastify";

import Container from "react-bootstrap/Container";

import styles from "./App.module.css";

import { useCurrentUser } from "./contexts/CurrentUserContext";
import "./api/axiosDefaults";

import NavBar from "./components/NavBar";
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
import TaskCreateForm from "./pages/tasks/TaskCreateForm";
import TaskDetail from "./pages/tasks/TaskDetail";
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

/** Main app component */
function App() {
  const currentUser = useCurrentUser();

  return (
    <div className={styles.App}>
      {/* header with navbar present on all pages */}
      <NavBar />
      {/* place indicator for notification messages, present on all pages */}
      <ToastContainer />
      {/* app content */}
      <Container className={styles.Main}>
        <Switch>
          {/* the home page is the landing page or Kanban board 
          depending on login status */}
          <Route
            exact
            path="/"
            render={() => (currentUser ? <TaskTabs /> : <Landing />)}
          />
          {/* tasks in list format with Profile List on the right */}
          <Route exact path="/list" render={() => <TaskTabs taskList />} />

          {/* Signin Form (only accessible to users who are not logged in) */}
          <Route exact path="/signin" render={() => <SignInForm />} />
          {/* Signup form (only accessible to users who are not logged in) */}
          <Route exact path="/signup" render={() => <SignUpForm />} />

          {/* Task Create Form (only accessible to users who are logged in) */}
          <Route exact path="/tasks/create" render={() => <TaskCreateForm />} />
          {/* Task Detail page (only accessible to users who are logged in) */}
          <Route exact path="/tasks/:id" render={() => <TaskDetail />} />
          {/* Task Edit Form (only accessible to users who are logged in) */}
          <Route exact path="/tasks/:id/edit" render={() => <TaskEditForm />} />
          {/* Full-page profile list (only accessible to users who are logged in) */}
          <Route
            exact
            path="/team"
            // render={() => (currentUser ? <ProfileList full /> : <SignInForm />)}
            render={() => <ProfileList full />}
          />
          {/* Profile Detail page (only accessible to users who are logged in) */}
          <Route
            exact
            path="/profiles/:id"
            render={() => (currentUser ? <ProfileDetail /> : <SignInForm />)}
          />
          {/* Profile Edit Form (only accessible to users who are logged in) */}
          <Route
            exact
            path="/profiles/:id/edit"
            render={() => <ProfileEditForm />}
          />
          {/* Username Edit Form (only accessible to users who are logged in) */}
          <Route
            exact
            path="/profiles/:id/edit/username"
            render={() => <UsernameForm />}
          />
          {/* Password Edit Form (only accessible to users who are logged in) */}
          <Route
            exact
            path="/profiles/:id/edit/password"
            render={() => <UserPasswordForm />}
          />
          {/* "Not found" page */}
          <Route render={() => <NotFound />} />
        </Switch>
      </Container>
      <Footer />
    </div>
  );
}

export default App;
