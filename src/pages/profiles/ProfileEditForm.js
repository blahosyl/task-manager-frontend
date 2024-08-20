import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";

import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";

// notification messages
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { axiosReq } from "../../api/axiosDefaults";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../../contexts/CurrentUserContext";

/** Enable users to edit their profile data */
const ProfileEditForm = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const { id } = useParams();
  const history = useHistory();
  const imageFile = useRef();

  const [profileData, setProfileData] = useState({
    firstname: "",
    lastname: "",
    role: "",
    pronouns: "",
    about: "",
    image: "",
  });
  const { firstname, lastname, role, pronouns, about, image } = profileData;

  const [errors, setErrors] = useState({});

  // code suggestion by Spencer Barriball
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    // Set isMounted to true when the component mounts
    // code suggestion by Spencer Barriball
    setIsMounted(true);

    const handleMount = async () => {
      if (currentUser?.profile_id?.toString() === id) {
        try {
          const { data } = await axiosReq.get(`/profiles/${id}/`);
          const { firstname, lastname, role, pronouns, about, image } = data;
          // conditional suggested by Spencer Barriball
          if (isMounted) {
            setProfileData({
              firstname,
              lastname,
              role,
              pronouns,
              about,
              image,
            });
          }
        } catch (err) {
          history.push("/");
        }
      } else {
        history.push("/");
      }
    };

    handleMount();

    // cleanup function to set isMounted to false when the component unmounts
    // code suggestion by Spencer Barriball
    return () => {
      setIsMounted(false);
    };
  }, [currentUser, history, id, isMounted]);

  const handleChange = (event) => {
    setProfileData({
      ...profileData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("firstname", firstname);
    formData.append("lastname", lastname);
    formData.append("role", role);
    formData.append("pronouns", pronouns);
    formData.append("about", about);

    if (imageFile?.current?.files[0]) {
      formData.append("image", imageFile?.current?.files[0]);
    }

    try {
      const { data } = await axiosReq.put(`/profiles/${id}/`, formData);
      setCurrentUser((currentUser) => ({
        ...currentUser,
        profile_image: data.image,
        // also update firstname and lastname of currentUser
        profile_firstname: data.firstname,
        profile_lastname: data.lastname,
      }));
      history.goBack();
    } catch (err) {
      setErrors(err.response?.data);
    }
  };

  // feedback messages for user CRUD
  const profileEditSuccessMsg = () => {
    toast.success("You have successfully edited your profile 🎉");
  };

  const profileEditCancelMsg = () => {
    toast.success("You chose not to edit your profile 👍");
  };

  const textFields = (
    <>
      <Form.Group>
        <Form.Label>First name</Form.Label>
        <Form.Control
          type="text"
          placeholder="First name"
          name="firstname"
          value={firstname}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.firstname?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
      <Form.Group>
        <Form.Label>Last name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Last name"
          name="lastname"
          value={lastname}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.lastname?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
      <Form.Group>
        <Form.Label>Role</Form.Label>
        <Form.Control
          type="text"
          placeholder="Role"
          name="role"
          value={role}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.role?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
      <Form.Group>
        <Form.Label>Pronouns</Form.Label>
        <Form.Control
          type="text"
          placeholder="Pronouns"
          name="pronouns"
          value={pronouns}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.pronouns?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
      <Form.Group>
        <Form.Label>About</Form.Label>
        <Form.Control
          as="textarea"
          value={about}
          onChange={handleChange}
          name="about"
          rows={7}
        />
      </Form.Group>

      {errors?.about?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
      <Button
        className={`${btnStyles.Button} ${btnStyles.BlueOutline}`}
        onClick={() => {
          history.goBack();
          profileEditCancelMsg();
        }}
      >
        cancel
      </Button>
      <Button
        className={`${btnStyles.Button} ${btnStyles.Blue}`}
        type="submit"
        onClick={() => {
          profileEditSuccessMsg();
        }}
      >
        save
      </Button>
    </>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col className="py-2 p-0 p-md-2 text-center" md={7} lg={6}>
          <Container className={`${appStyles.Content} ${appStyles.Rounded}`}>
            <Form.Group>
              {image && (
                <figure>
                  <Image src={image} fluid />
                </figure>
              )}
              {errors?.image?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                  {message}
                </Alert>
              ))}
              <div>
                <Form.Label
                  className={`${btnStyles.Button} ${btnStyles.Blue} btn my-auto`}
                  htmlFor="image-upload"
                >
                  Change the image
                </Form.Label>
              </div>
              <Form.File
                id="image-upload"
                ref={imageFile}
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files.length) {
                    setProfileData({
                      ...profileData,
                      image: URL.createObjectURL(e.target.files[0]),
                    });
                  }
                }}
              />
            </Form.Group>
            <div className="d-md-none">{textFields}</div>
          </Container>
        </Col>
        <Col md={5} lg={6} className="d-none d-md-block p-0 p-md-2 text-center">
          <Container className={`${appStyles.Content} ${appStyles.Rounded}`}>
            {textFields}
          </Container>
        </Col>
      </Row>
    </Form>
  );
};

export default ProfileEditForm;
