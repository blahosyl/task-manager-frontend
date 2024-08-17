import axios from "axios";
import { useEffect } from "react";
import { useHistory } from "react-router";

export const useRedirect = (userAuthStatus) => {
  const history = useHistory();

  /** Redirect logged-in users to the home page, logged-out users to the signin page */
  useEffect(() => {
    const handleMount = async () => {
      try {
        await axios.post("/dj-rest-auth/token/refresh/");
        // if user is logged in, the code below will run
        if (userAuthStatus === "loggedIn") {
          history.push("/");
        }
      } catch (err) {
        // if user is not logged in, the code below will run
        if (userAuthStatus === "loggedOut") {
          history.push("/signin/");
        }
      }
    };

    // wait 4 seconds before redirecting
    const timer = setTimeout(() => {
      handleMount();
    }, 4000);

    return () => {
      clearTimeout(timer);
    };
  }, [history, userAuthStatus]);
};
