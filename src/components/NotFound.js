import React from 'react'
import styles from "../styles/NotFound.module.css"
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

const NotFound = () => {
  return (
    <div className={styles.NotFound}>
        <p>Sorry, the page you're looking for doesn't exist</p>
        <Link 
          className={styles.NotFoundLink}
          to="/"
        >Click here to go back to the home page</Link>
    </div>
  );
};

export default NotFound