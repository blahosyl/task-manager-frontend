import React, { useRef, useState, useEffect } from "react";

// notification messages
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";

import styles from "../../styles/TaskCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import { useHistory, useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import { useRedirect } from "../../hooks/useRedirect";

import { useCurrentUser } from "../../contexts/CurrentUserContext";
import {
  useProfileData,
  useSetProfileData,
} from "../../contexts/ProfileDataContext";

import Upload from "../../assets/upload.png";
import Asset from "../../components/Asset";
import Image from "react-bootstrap/Image";

/** Used for the TaskCreateForm and TaskEditForm
 * rendering/function depens on  `editForm` prop
 */
function TaskForm(props) {
  const { editForm } = props;

  // redirect logged out users
  useRedirect("loggedOut");

  const [errors, setErrors] = useState({});

  // get the currentUser form CurrentUserContext
  const currentUser = useCurrentUser();

  // get profile data from ProfileDataContext
  const { profileList } = useProfileData();
  // constant by John Rearden
  const setProfileList = useSetProfileData();

  // the array of profiles (initially 10)
  const profiles = profileList.results;
  // the link to the next page of profiles
  const nextProfilesLink = profileList.next;

  /** Fetch all profiles (beyond the pagination of 10)
   * This is used for the assignee dropdown select form
   */
  useEffect(() => {
    // nextProfiles is based on the function by John Rearden in the `next` prop of
    //  `InfiniteScroll` in `ProfileList`
    const nextProfiles = async () => {
      try {
        const { data } = await axiosReq.get(nextProfilesLink);
        setProfileList((prev) => ({
          ...prev,
          profileList: {
            next: data.next,
            results: [...prev.profileList.results, ...data.results],
          },
        }));
      } catch (err) {
      }
    };
    nextProfilesLink && nextProfiles();
  }, [profileList, nextProfilesLink, setProfileList]);

  const [taskData, setTaskData] = useState({
    title: "",
    excerpt: "",
    description: "",
    assignee: "",
    priority: "",
    status: "",
    due_date: "",
    image: "",
  });

  const {
    title,
    excerpt,
    description,
    assignee,
    priority,
    status,
    due_date,
    image,
  } = taskData;

  const imageInput = useRef(null);
  const history = useHistory();

  const { id } = useParams();

  /** Fetch task data for the EditForm */
  useEffect(() => {
    const handleMount = async () => {
      if (editForm) {
        try {
          const { data } = await axiosReq.get(`/tasks/${id}/`);
          const {
            title,
            excerpt,
            description,
            assignee,
            priority,
            status,
            due_date,
            image,
            is_owner,
          } = data;

          is_owner
            ? setTaskData({
                title,
                excerpt,
                description,
                assignee,
                priority,
                status,
                due_date,
                image,
              })
            : history.push("/");
        } catch (err) {
        }
      }
    };

    handleMount();
  }, [history, id, editForm]);

  /** Change image */
  const handleChangeImage = (event) => {
    if (event.target.files.length) {
      URL.revokeObjectURL(image);
      setTaskData({
        ...taskData,
        image: URL.createObjectURL(event.target.files[0]),
      });
    }
  };

  /** Change task data */
  const handleChange = (event) => {
    setTaskData({
      ...taskData,
      [event.target.name]: event.target.value,
    });
  };

  /** Submit task data */
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("title", title);
    formData.append("excerpt", excerpt);
    formData.append("description", description);
    // solution suggested by tutor Roo: specify "" as a valid option for the field
    formData.append("assignee", assignee || "");
    formData.append("priority", priority);
    formData.append("status", status);
    // based on tutor Roo's solution for the assignee field
    formData.append("due_date", due_date || "");
    // only append image form data if there is an image

    if (imageInput?.current?.files[0]) {
      formData.append("image", imageInput.current.files[0]);
    }

    // different API endpoint for editing & creating
    try {
      if (editForm) {
        await axiosReq.put(`/tasks/${id}/`, formData);
        history.push(`/tasks/${id}`);
      } else {
        const { data } = await axiosReq.post("/tasks/", formData);
        history.push(`/tasks/${data.id}`);
      }
    } catch (err) {
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
      }
    }
  };

  // feedback messages for user CRUD
  const taskCreateSuccessMsg = () => {
    toast.success("You have successfully created a task 🎉");
  };

  const taskCreateCancelMsg = () => {
    toast.success("You chose not to create a new task 👍");
  };

  const taskEditSuccessMsg = () => {
    toast.success("You have successfully edited the task 🎉");
  };

  const taskEditCancelMsg = () => {
    toast.success("You chose not to edit the task 👍");
  };

  // submit/cancel buttons (appear in different places depending on viewport size)
  const buttons = (
    <div className="my-2 mx-auto text-center">
      <Button
        className={`${btnStyles.Button} ${btnStyles.BlueOutline}`}
        onClick={() => {
          history.goBack();
          // cancel button message depending on edit/create
          editForm ? taskEditCancelMsg() : taskCreateCancelMsg();
        }}
      >
        cancel
      </Button>
      <Button
        className={`${btnStyles.Button} ${btnStyles.Blue}`}
        type="submit"
        // disable button if title field empty
        disabled={!title.trim()}
        onClick={() => {
          // submit button message depending on edit/create
          editForm ? taskEditSuccessMsg() : taskCreateSuccessMsg();
        }}
      >
        {/* change button text depending on whether creating or editing task */}
        {editForm ? "save" : "create"}
      </Button>
      {/* show instruction if title field is empty */}
      {!title && <p>You must specify a title for the task</p>}
    </div>
  );

  // text fields in the edit/create form
  const textFields = (
    <div className="text-center">
      <Form.Group>
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          placeholder="Title (required)"
          name="title"
          value={title}
          required
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.title?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <Form.Group>
        <Form.Label>Excerpt</Form.Label>
        <Form.Control
          type="text"
          placeholder="Short summary of the task"
          name="excerpt"
          value={excerpt}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.excerpt?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <Form.Group>
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows="6"
          placeholder="Detailed description of the task"
          name="description"
          value={description}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.description?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
    </div>
  );

  return (
    <Form onSubmit={handleSubmit}>
      {/* change heading depending on whether creating or editing task */}
      <h1>{editForm ? "Edit task" : "Create task"}</h1>
      <Row>
        <Col md={8} className="d-block d-md-none">
          {buttons}
        </Col>

        <Col md={8} className="d-none d-md-block p-0 p-md-2">
          <Container
            className={`
              ${appStyles.Content}
              ${appStyles.Rounded}
            `}
          >
            {textFields}
          </Container>
          <Row className="my-4">{buttons}</Row>
        </Col>

        <Col className="py-2 p-0 p-md-2" md={4}>
          <Container
            className={`
              ${appStyles.Content} 
              ${styles.Container} 
              ${appStyles.Rounded}
              d-flex flex-column justify-content-center
            `}
          >
            <div className="d-md-none">{textFields}</div>

            <Form.Group controlId="assignee">
              <Form.Label>Assigned to</Form.Label>
              <Form.Control
                as="select"
                name="assignee"
                value={assignee}
                onChange={handleChange}
              >
                {/* profile list retrieved dynamically */}
                <option value="">none</option>
                {/* if profiles are retrieved */}
                {/* conditional added at the suggestion of tutor Oisin */}
                {profiles.length && (
                  <>
                    {profiles.map((profile) => {
                      return (
                        <option key={profile.id} value={profile.id}>
                          {/* show first name, last name or both if available
                          otherwise, show username */}
                          {profile.firstname
                            ? profile.firstname + " " + profile.lastname
                            : profile.lastname
                            ? profile.lastname
                            : profile.owner}
                          {/* add "me" to the current user's name in the dropdown */}
                          {currentUser?.username === profile.owner
                            ? " (me)"
                            : ""}
                        </option>
                      );
                    })}
                  </>
                )}
              </Form.Control>
            </Form.Group>
            {errors?.assignee?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}
            <Form.Group controlId="status">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={status}
                onChange={handleChange}
              >
                {/* value props have to match STATUS_OPTIONS in task/models.py */}
                <option value="TO-DO">To do</option>
                <option value="IN-PROGRESS">In progress</option>
                <option value="DONE">Done</option>
              </Form.Control>
            </Form.Group>
            {errors?.status?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}

            <Form.Group controlId="priority">
              <Form.Label>Priority</Form.Label>
              <Form.Control
                as="select"
                name="priority"
                value={priority}
                onChange={handleChange}
              >
                {/* value props have to match PRIORITY_OPTIONS in task/models.py */}
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </Form.Control>
            </Form.Group>
            {errors?.priority?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}

            <Form.Group controlId="due_date">
              <Form.Label>Due date</Form.Label>
              <Form.Control
                type="date"
                name="due_date"
                value={due_date}
                onChange={handleChange}
              ></Form.Control>
            </Form.Group>
            {errors?.due_date?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}
          </Container>
          {/* </Col>
        <Col className="py-2 p-0 p-md-2" md={3} lg={4}> */}
          <Container
            className={`
              ${appStyles.Content} 
              ${styles.Container}
              ${appStyles.Rounded}
              d-flex flex-column justify-content-center mt-3
            `}
          >
            <Form.Group className="text-center">
              {image ? (
                <>
                  <figure>
                    <Image className={appStyles.Image} src={image} rounded />
                  </figure>
                  <div>
                    <Form.Label
                      className={`${btnStyles.Button} ${btnStyles.Blue} btn`}
                      htmlFor="image-upload"
                    >
                      Change the image
                    </Form.Label>
                  </div>
                </>
              ) : (
                <Form.Label
                  className="d-flex justify-content-center"
                  htmlFor="image-upload"
                >
                  <Asset
                    src={Upload}
                    message="Click or tap to upload an image"
                  />
                </Form.Label>
              )}

              <Form.File
                id="image-upload"
                accept="image/*"
                onChange={handleChangeImage}
                ref={imageInput}
              />
            </Form.Group>
            {errors?.image?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}
          </Container>
        </Col>
      </Row>
    </Form>
  );
}

export default TaskForm;
