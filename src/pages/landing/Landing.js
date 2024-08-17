import React from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
// import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";

import { Link } from "react-router-dom";

import styles from "../../styles/Landing.module.css";
import signupStyles from "../../styles/SignInUpForm.module.css";
import appStyles from "../../App.module.css";
import ThisIsFine from "../../assets/this-is-fine.gif";


function Landing() {
  return (
    <Row
      className={`
        ${signupStyles.Row}
        ${signupStyles.Swirl}
        justify-content-center
    `}
    >
      <Col className="my-auto p-0 p-md-2" md={6}>
        <Container
          className={`
            ${appStyles.Content} 
            ${appStyles.Rounded} 
            p-4 `}
        >
          <h1 className={signupStyles.Header}>Welcome!</h1>

          <p>Some days, you're on fire and ticking off your to-do items
          like nobody's business 💪
          </p>

          <p>Other days, everything around you seems to be on fire 
            and you're sitting in the middle of it going "this is fine" 
            <img alt="" loading="lazy" width="40" 
            src={ThisIsFine}></img>
          </p>

          <p>No matter what what the situation is, this cheerful task manager 
            helps you keep track of your tasks, 
            see how your teammates are getting on, and feel energized in the process!
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
      {/* <Col
        md={6}
        className={`my-auto d-none d-md-block p-2 ${styles.SignInCol}`}
      >
        <Image
          className={`${appStyles.FillerImage}`}
          src={door}
        />
      </Col> */}
    </Row>
  );
}

export default Landing;
