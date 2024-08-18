import React from "react";

import { Link } from "react-router-dom";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import styles from "../../styles/Landing.module.css";
import signupStyles from "../../styles/SignInUpForm.module.css";
import appStyles from "../../App.module.css";
import ThisIsFine from "../../assets/this-is-fine.gif";

/** Render the landing page for not logged in users,
 * with links to signin & signup pages */
function Landing() {
  return (
    <Row
      className={`
        ${signupStyles.Row}
        ${signupStyles.Swirl}
        justify-content-center
    `}
    >
      <Col className="my-auto py-2 p-md-2" md={8} lg={6}>
        <Container
          className={`
            ${appStyles.Content} 
            ${appStyles.Rounded} 
            p-4 `}
        >
          <h1 className={`${signupStyles.Header} mb-4`}>On Fire 🔥</h1>

          <p>
            Some days, you're on fire and ticking off your to-do items like
            nobody's business 💪
          </p>

          <p>
            Other days, everything around you seems to be on fire and you're
            sitting in the middle of it going "this is fine"
            <img alt="" loading="lazy" width="40" src={ThisIsFine}></img>
          </p>

          <p>
            No matter what what the situation is, this cheerful task manager
            helps you keep track of your tasks, see how your teammates are
            getting on, and feel energized in the process!
          </p>
        </Container>
        <Container
          className={`mt-3 text-center
          ${appStyles.Content}
          ${appStyles.LittleRounded}
          `}
        >
          <Link to="/signin" className={styles.TextLink}>
            <span>Sign in</span>
          </Link>
          <span> or </span>
          <Link to="/signup" className={styles.TextLink}>
            <span>Sign up</span>
          </Link>
          <span> to use the app </span>
        </Container>
      </Col>
    </Row>
  );
}

export default Landing;
