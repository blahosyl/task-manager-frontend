import React, { useState } from "react";
import axios from "axios";

import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
// import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";

import { Link, useHistory } from "react-router-dom";

import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";
import { useSetCurrentUser } from "../../contexts/CurrentUserContext";
import { useRedirect } from "../../hooks/useRedirect";
import { setTokenTimestamp } from "../../utils/utils";

// import door from "../../assets/door.jpg";

function SignInForm() {
  const setCurrentUser = useSetCurrentUser();
  
  // redirect logged-in users
  useRedirect("loggedIn");

  const [signInData, setSignInData] = useState({
    username: "",
    password: "",
  });
  const { username, password } = signInData;

  const [errors, setErrors] = useState({});

  const history = useHistory();
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await axios.post("/dj-rest-auth/login/", signInData);
      setCurrentUser(data.user);
      // store token timestamp in local storage
      setTokenTimestamp(data);
      // redirect user
      history.goBack();
        } catch (err) {
      setErrors(err.response?.data);
    }
  };

  const handleChange = (event) => {
    setSignInData({
      ...signInData,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <Row className={`
      ${styles.Row}
      ${styles.Door}
      p-md-4
    `}>
      <Col className="my-auto py-2 p-md-2" md={6}>
        <Container className={`
          ${appStyles.Content}
          ${appStyles.Rounded}
          p-4 
        `}>
          <h1 className={styles.Header}>sign in</h1>
          <Form onSubmit={handleSubmit} className="text-center">
            <Form.Group controlId="username">
              <Form.Label className="d-none">Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="username"
                name="username"
                required
                className={styles.Input}
                value={username}
                onChange={handleChange}
              />
            </Form.Group>
            {errors.username?.map((message, idx) => (
              <Alert key={idx} variant="warning">
                {message}
              </Alert>
            ))}

            <Form.Group controlId="password">
              <Form.Label className="d-none">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="password"
                name="password"
                required
                className={styles.Input}
                value={password}
                onChange={handleChange}
              />
            </Form.Group>
            {errors.password?.map((message, idx) => (
              <Alert key={idx} variant="warning">
                {message}
              </Alert>
            ))}
            <Button
              className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright}`}
              type="submit"
            >
              Sign in
            </Button>
            {errors.non_field_errors?.map((message, idx) => (
              <Alert key={idx} variant="warning" className="mt-3">
                {message}
              </Alert>
            ))}
            <p className="mt-3 mb-0 text-center smaller">
              <small>
              You need to have third-party cookies enabled to sign in.
              </small>
            </p>
          </Form>
        </Container>
        <Container className={`
          mt-3 
          ${appStyles.Content}
          ${appStyles.LittleRounded}
        `}>
          <Link className={styles.Link} to="/signup">
            Don't have an account? <span>Sign up</span>
          </Link>
        </Container>
      </Col>
    </Row>
  );
}

export default SignInForm;