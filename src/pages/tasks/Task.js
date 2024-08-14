import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Tooltip from "react-bootstrap/Tooltip";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";

// date formatting
import dayjs from "dayjs";

// notification messages
import { toast } from 'react-toastify';  
import "react-toastify/dist/ReactToastify.css";

import { Link, useHistory } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefaults";

import Avatar from "../../components/Avatar";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import appStyles from "../../App.module.css";
import styles from "../../styles/Task.module.css";
// import btnStyles from "../../styles/Button.module.css";
import { MoreDropdown } from "../../components/MoreDropdown";
import { ListGroupItem } from "react-bootstrap";

const Task = (props) => {
  const {
    id,
    owner,
    created_at,
    updated_at,
    title,
    excerpt,
    description,
    assignee,
    assignee_username,
    assignee_firstname,
    assignee_lastname,
    assignee_image,
    image,
    priority,
    status,
    due_date,
    owner_id,
    owner_firstname,
    owner_lastname,
    owner_image,
    watched_id,
    watchers_count,
    taskDetail,
    taskList,
    setTasks,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const history = useHistory();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // feedback messages for user CRUD
   
  const taskDeleteSuccessMsg = () => {
    toast.success("You have successfully deleted the task 🎉")
  };

  const taskDeleteCancelMsg = () => {
    toast.success("You chose not to delete the task 👍")
  }; 

  const handleEdit = () => {
    history.push(`/tasks/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/tasks/${id}/`);
      // redirect to home page after deleting a task
      history.push(`/`);
    } catch (err) {
      console.log(err);
      setShowDeleteModal(false);
    }
  };

  const handleWatch = async () => {
    try {
      // make API request
      // sending the correct id (watched) solved with the help of tutor Oisin
      const { data } = await axiosRes.post("/watchers/", { watched: id });
      //   update task data
      setTasks((prevTasks) => ({
        ...prevTasks,
        results: prevTasks.results.map((task) => {
          return task.id === id
            ? {
                ...task,
                watchers_count: task.watchers_count + 1,
                watched_id: data.id,
              }
            : task;
        }),
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnwatch = async () => {
    try {
      await axiosRes.delete(`/watchers/${watched_id}/`);
      setTasks((prevTasks) => ({
        ...prevTasks,
        results: prevTasks.results.map((task) => {
          return task.id === id
            ? {
                ...task,
                watchers_count: task.watchers_count - 1,
                watched_id: null,
              }
            : task;
        }),
      }));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card
      className={`${styles.Task}
      ${appStyles.Rounded}
    `}
    >
      <Card.Header
        className={`
          ${appStyles.RoundedTop}
          // set background color depending on task priority
          ${
            priority === String("LOW")
              ? styles.DarkLowBg
              : priority === String("MEDIUM")
              ? styles.DarkMedBg
              : priority === String("HIGH")
              ? styles.DarkHighBg
              : {}
          }
        `}
      >
        <Row>
          {/* empty col for balancing header content */}
          <Col className={`col-1 d-none s-d-block`}></Col>
          <Col>
            {/* Display assignee image & name or "not assigned" */}
            {assignee ? (
              <Link
                to={`/profiles/${assignee}`}
                className={`
                  ${styles.AvatarColumn}
                  // set background color depending on task priority
                  ${
                    priority === String("LOW")
                      ? styles.DarkLowBg
                      : priority === String("MEDIUM")
                      ? styles.DarkMedBg
                      : priority === String("HIGH")
                      ? styles.DarkHighBg
                      : {}
                  }
               `}
              >
                <Avatar src={assignee_image} height={55} />
                {/* render "me" if logged-in user is viewing their own profile
                  else show first name, last name or both if available
                  otherwise, show username */}
                {currentUser?.username === assignee_username
                  ? "me"
                  :assignee_firstname
                  ? assignee_firstname + " " + assignee_lastname
                  : assignee_lastname
                  ? assignee_lastname
                  : assignee_username}
              </Link>
            ) : (
              <span>Not assigned</span>
            )}
          </Col>

          {/* task assignee, status & priority */}
          <Col className={styles.CardHeaderText}>
            {/* Show status in a human readable format on TaskList and Task Detail pages.
            Even though status` is a str, === only works if this is
            explicitely specified, and == produces a warning*/}
            {(taskList || taskDetail) && 
              <span className={`mb-1`}>
                {status === String("TO-DO")
                  ? "To Do"
                  : status === String("IN-PROGRESS")
                  ? "In Progress"
                  : status === String("DONE")
                  ? "Done"
                  : "no status defined"}
              </span>
            } 
            {/* Show priority in a human readable format on large screens.
            Even though status` is a str, === only works if this is
            explicitely specified, and == produces a warning*/}
            <span className={`mt-1 d-none d-lg-inline`}>
              {priority === String("LOW")
                ? "Low Priority"
                : priority === String("MEDIUM")
                ? "Med Priority"
                : priority === String("HIGH")
                ? "High Priority"
                : "Priority not defined"}
            </span>
          </Col>

          {/* edit/delete dropdown available on both TaskDetail & TaskList views */}
          <Col
            className={`
            ${styles.MoreDropdown} 
            col-1
              // set background color depending on task priority
              ${
                priority === String("LOW")
                  ? styles.DarkLowBg
                  : priority === String("MEDIUM")
                  ? styles.DarkMedBg
                  : priority === String("HIGH")
                  ? styles.DarkHighBg
                  : {}
              }            
            `}
          >
            {/* show the edit/delete dropdown if the logged-in user is the owner */}
            {is_owner && (
              <MoreDropdown
                handleEdit={handleEdit}
                handleDelete={() => setShowDeleteModal(true)}
              />
            )}{" "}
          </Col>
          {/* deletion confirmation modal based on 
          https://github.com/Code-Institute-Submissions/ci_pp5_tick_it_react */}
          <Modal
            show={showDeleteModal}
            onHide={() => setShowDeleteModal(false)}
            centered={true}
          >
            <Modal.Header closeButton>
              <Modal.Title>Confirm Deletetion</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete this task?</Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowDeleteModal(false);
                  taskDeleteCancelMsg();
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="danger" 
                onClick={() => {
                  handleDelete();
                  taskDeleteSuccessMsg();
                }}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </Row>
      </Card.Header>
      <Card.Body className="py-1">
        <Row>
          <Col>
            {title && (
              <Card.Title
                className={`my-3 
                  ${styles.CardTitle}
                  ${taskDetail && styles.LargeTitle}
                  // set title color depending on task priority
                  ${
                    priority === String("LOW")
                      ? styles.DarkLowText
                      : priority === String("MEDIUM")
                      ? styles.DarkMedText
                      : priority === String("HIGH")
                      ? styles.DarkHighText
                      : {}
                  }`}
              >
                {title}
              </Card.Title>
            )}

            {/* only show excerpt in TaskList and TaskDetail view */}
            {excerpt && (taskList || taskDetail) && <Card.Subtitle>{excerpt}</Card.Subtitle>}

          {/* show fire symbols if task is overdue */}
          {dayjs() > dayjs(due_date) && (
            <Row className="mt-3 justify-content-center">
              {(dayjs().diff(due_date, "weeks")) > 2
              ? <span className="h3">🔥🔥🔥🔥</span>
              : (dayjs().diff(due_date, "weeks")) > 1
              ? <span className="h3">🔥🔥🔥</span>
              : (dayjs().diff(due_date, "weeks")) > 0
              ? <span className="h3">🔥🔥</span>
              : <span className="h3">🔥</span> 
              }
            </Row>
          )}

            {/* render link to Task Detail page in TaskList */}
            {!taskDetail && (
              <Row>
                <Link
                  to={`/tasks/${id}/`}
                  className={`
                mt-2
                stretched-link
                ${styles.DetailLink}
                // set title color depending on task priority
                ${
                  priority === String("LOW")
                    ? styles.VeryDarkLowText
                    : priority === String("MEDIUM")
                    ? styles.VeryDarkMedText
                    : priority === String("HIGH")
                    ? styles.VeryDarkHighText
                    : {}
                }`}
                >
                  Click/tap to view task details
                </Link>
              </Row>
            )}

          </Col>
        </Row>
      </Card.Body>

      <div
        className={`
                ${styles.DateEyeContainer}
                // make it narrower on TaskDetail page
                ${taskDetail
                  ? styles.DateEyeNarrow
                  : styles.DateEyeContainer
                }
                // only round top on TaskDetail page
                ${taskDetail
                  ? appStyles.LittleRounded
                  : appStyles.LittleRoundedBottom
                }
                // set background color depending on task priority
                ${
                  priority === String("LOW")
                    ? styles.LightLowBg
                    : priority === String("MEDIUM")
                    ? styles.LightMedBg
                    : priority === String("HIGH")
                    ? styles.LightHighBg
                    : {}
                }
              `}
      >
        
        <Col className={`${styles.DateContainer}`}>
        {taskDetail && <span className={`mr-2`}>Due:</span>}
          <span>{due_date 
            ? taskDetail
              ? dayjs(due_date).format('ddd | D MMM YYYY') 
              : dayjs(due_date).format('D MMM') 
            : ""
            }
          </span>
        </Col>

        {/* watch/unwatch functionality & watcher count */}
        <Col className={styles.EyeContainer}>
          {watched_id ? (
            <OverlayTrigger
              placement="top"
              // tooltip text not a mistake:
              // it will activate AFTER the onclick function is run
              overlay={<Tooltip>Unwatch task</Tooltip>}
            >
              <span onClick={handleUnwatch}>
                <i
                  className={`
                    fa-solid fa-eye 
                    // set color depending on task priority
                    ${
                      priority === String("LOW")
                        ? styles.EyeLow
                        : priority === String("MEDIUM")
                        ? styles.EyeMed
                        : priority === String("HIGH")
                        ? styles.Eye
                        : // default case has same color effects as HIGH
                          styles.Eye
                    }
                  `}
                />
              </span>
            </OverlayTrigger>
          ) : currentUser ? (
            <OverlayTrigger
              placement="top"
              // tooltip text not a mistake:
              // it will activate AFTER the onclick function is run
              overlay={<Tooltip>Watch task</Tooltip>}
            >
              <span onClick={handleWatch}>
                <i
                  className={`
                    fa-regular fa-eye 
                    // set color depending on task priority
                    ${
                      priority === String("LOW")
                        ? styles.EyeOutlineLow
                        : priority === String("MEDIUM")
                        ? styles.EyeOutlineMed
                        : priority === String("HIGH")
                        ? styles.EyeOutline
                        : // default case has same color effects as HIGH
                          styles.EyeOutline
                    }
                  `}
                />
              </span>
            </OverlayTrigger>
          ) : (
            <OverlayTrigger
              placement="top"
              //   this might have to be changed/removed,
              // as only logged-in users will be able to see tasks
              overlay={<Tooltip>Log in to follow tasks!</Tooltip>}
            >
              <i className="fa-solid fa-eye" />
            </OverlayTrigger>
          )}
          {watchers_count}
        </Col>
      </div>

      {/* only show extended info on Task Detail page */}
      {taskDetail && (
        <Card.Body>
          <ListGroup variant="flush">
            {description && <ListGroup.Item>{description}</ListGroup.Item>}
            {updated_at && (
              <ListGroup.Item>Last updated on: {dayjs(updated_at).format('ddd | D MMM YYYY')}</ListGroup.Item>
            )}
            {created_at && (
              <ListGroup.Item>Created on: {dayjs(created_at).format('ddd | D MMM YYYY')}</ListGroup.Item>
            )}
            <ListGroupItem>
              <Row>
                <Col className={styles.CreatedBy}>Created by:
                <Link to={`/profiles/${owner_id}`} className={styles.Avatar}>
                  <Avatar src={owner_image} height={55} />
                  {/* render "me" if logged-in user is viewing their own profile
                  else show first name, last name or both if available
                  otherwise, show username */}
                  {currentUser?.username === owner
                    ? "me"
                    :owner_firstname
                    ? owner_firstname + " " + owner_lastname
                    : owner_lastname
                    ? owner_lastname
                    : owner
                  }
                </Link>
                </Col>
              </Row>
            </ListGroupItem>
          </ListGroup>

          {image && (
          <Card.Img src={image} alt={title} />)}
          <div className={styles.TaskBar}>
          </div>
          
        </Card.Body>
      )}
    </Card>
  );
};

export default Task;
