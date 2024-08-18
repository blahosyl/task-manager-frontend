import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

import styles from "../styles/NotFound.module.css";

/** Renders when the page the user navigates to does not exist */
const NotFound = () => {
  return (
    <div className={styles.NotFound}>
      <p>Sorry, the page you're looking for doesn't exist</p>
      <Link className={styles.NotFoundLink} to="/">
        Click here to go back to the home page
      </Link>
    </div>
  );
};

export default NotFound;
