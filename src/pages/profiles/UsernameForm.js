import React, { useEffect, useState } from "react";

// notification messages
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";

import { useHistory, useParams } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefaults";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../../contexts/CurrentUserContext";

/** Handle logged-in users changing their own username */
const UsernameForm = () => {
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState({});

  const history = useHistory();
  const { id } = useParams();

  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  useEffect(() => {
    if (currentUser?.profile_id?.toString() === id) {
      setUsername(currentUser.username);
    } else {
      history.push("/");
    }
  }, [currentUser, history, id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosRes.put("/dj-rest-auth/user/", {
        username,
      });
      setCurrentUser((prevUser) => ({
        ...prevUser,
        username,
      }));
      history.goBack();
    } catch (err) {
      console.log(err);
      setErrors(err.response?.data);
    }
  };

  // feedback messages for user CRUD
  const usernameEditSuccessMsg = () => {
    toast.success("You have successfully changed your username 🎉");
  };

  const usernameEditCancelMsg = () => {
    toast.success("You chose not to change your username 👍");
  };

  return (
    <Row>
      <Col className="py-2 mx-auto text-center" md={6}>
        <Container className={`${appStyles.Content} ${appStyles.Rounded}`}>
          <Form onSubmit={handleSubmit} className="my-2">
            <Form.Group>
              <Form.Label>Change username</Form.Label>
              <Form.Control
                placeholder="username (required)"
                type="text"
                value={username}
                required
                onChange={(event) => setUsername(event.target.value)}
              />
            </Form.Group>
            {errors?.username?.map((message, idx) => (
              <Alert key={idx} variant="warning">
                {message}
              </Alert>
            ))}
            <Button
              className={`${btnStyles.Button} ${btnStyles.BlueOutline}`}
              onClick={() => {
                history.goBack();
                usernameEditCancelMsg();
              }}
            >
              cancel
            </Button>
            <Button
              className={`${btnStyles.Button} ${btnStyles.Blue}`}
              type="submit"
              onClick={() => {
                usernameEditSuccessMsg();
              }}
            >
              save
            </Button>
          </Form>
        </Container>
      </Col>
    </Row>
  );
};

export default UsernameForm;
