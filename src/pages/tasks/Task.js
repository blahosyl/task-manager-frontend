import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefaults";

// date formatting
import dayjs from "dayjs";

// notification messages
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Card from "react-bootstrap/Card";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Tooltip from "react-bootstrap/Tooltip";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";

import appStyles from "../../App.module.css";
import styles from "../../styles/Task.module.css";
import btnStyles from "../../styles/Button.module.css";

import Avatar from "../../components/Avatar";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { MoreDropdown } from "../../components/MoreDropdown";

/** Render the task card on the Kanban board, Task List view, Profile Detail & Task Detail
 * The information shown depends on the view
 * The color scheme of the card depends on the priority of the task
 */
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
    setTabListChanged,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

  const history = useHistory();

  // the modal confirming deletion
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // feedback messages for user CRUD
  const taskDeleteSuccessMsg = () => {
    toast.success("You have successfully deleted the task 🎉");
  };

  const taskDeleteCancelMsg = () => {
    toast.success("You chose not to delete the task 👍");
  };

  const handleEdit = () => {
    history.push(`/tasks/${id}/edit`);
  };

  /** Handle task deletion
   * `setTabListChanged` triggers refresh in `TaskTabs`
   */
  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/tasks/${id}/`);
      // update the list of tasks after deletion
      // setTasks block suggested by tutor Roman
      setTasks((prevTasks) => ({
        ...prevTasks,
        results: prevTasks.results.filter((task) => task.id !== id),
      }));
      // redirect to TaskList or TaskKanban (home) page after deleting a task
      taskList ? history.push("/list") : history.push(`/`);
      setTabListChanged(true);
    } catch (err) {
      setShowDeleteModal(false);
    }
  };

  /** Let a user watch a task
   * `setTabListChanged` triggers refresh in `TaskTabs` & `ProfileDetail`
   */
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
      setTabListChanged(true);
    } catch (err) {
    }
  };

  /** Let a user unwatch a task
   * `setTabListChanged` triggers refresh in `TaskTabs` & `ProfileDetail`
   */
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
      setTabListChanged(true);
    } catch (err) {
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
          <Col className={`mt-1`}>
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
                  : assignee_firstname
                  ? assignee_firstname + " " + assignee_lastname
                  : assignee_lastname
                  ? assignee_lastname
                  : assignee_username}
              </Link>
            ) : (
              <Col className={`mt-1`}>
                Not assigned
              </Col>
            )}
          </Col>

          {/* task status & priority */}
          <Col className={`${styles.CardHeaderText} d-flex`}>
            {/* Show status in a human readable format on TaskList and Task Detail pages.
            Even though status` is a str, === only works if this is
            explicitly specified, and == produces a warning*/}
            {(taskList || taskDetail) && (
              <span className={`mb-1`}>
                {status === String("TO-DO")
                  ? "To Do"
                  : status === String("IN-PROGRESS")
                  ? "In Progress"
                  : status === String("DONE")
                  ? "Done"
                  : "no status defined"}
              </span>
            )}
            {/* Show priority in a human readable format on large screens.
            Even though status` is a str, === only works if this is
            explicitly specified, and == produces a warning*/}
            <span
              className={`
                mt-1 d-none 
                d-md-inline
              `}
            >
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
            className={`${appStyles.Rounded}`}
          >
            <Modal.Header closeButton>
              <Modal.Title>Confirm Deletion</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete this task?</Modal.Body>
            <Modal.Footer>
              <Button
                className={`${btnStyles.Button} ${btnStyles.DangerOutline}`}
                onClick={() => {
                  setShowDeleteModal(false);
                  taskDeleteCancelMsg();
                }}
              >
                Cancel
              </Button>
              <Button
                className={`${btnStyles.Button} ${btnStyles.Danger}`}
                // adding `async` suggested by tutor Roman
                onClick={async () => {
                  await handleDelete();
                  taskDeleteSuccessMsg();
                }}
              >
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
            {excerpt && (taskList || taskDetail) && (
              <Card.Subtitle className="text-center mb-2">
                {excerpt}
              </Card.Subtitle>
            )}

            {/* show fire symbols if task is overdue */}
            {dayjs() > dayjs(due_date) && (
              <Row className="mt-3 justify-content-center">
                {dayjs().diff(due_date, "weeks") > 2 ? (
                  <span className="h3">🔥🔥🔥🔥</span>
                ) : dayjs().diff(due_date, "weeks") > 1 ? (
                  <span className="h3">🔥🔥🔥</span>
                ) : dayjs().diff(due_date, "weeks") > 0 ? (
                  <span className="h3">🔥🔥</span>
                ) : (
                  <span className="h3">🔥</span>
                )}
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
                ${taskDetail ? styles.DateEyeNarrow : styles.DateEyeContainer}
                // only round top on TaskDetail page
                ${
                  taskDetail
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
          <span className={`mr-2`}>
            {(taskDetail || taskList) && "Due"}
            {taskDetail && " date"}
            {(taskDetail || taskList) && ":"}
          </span>
          {/* render due date in short or long format depending on view */}
          <span>
            {due_date
              ? taskDetail
                ? dayjs(due_date).format("ddd | D MMM YYYY")
                : dayjs(due_date).format("D MMM")
              : taskDetail || taskList
              ? "not specified"
              : ""}
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
            {description && (
              <Card.Text className="mb=4 text-center">{description}</Card.Text>
            )}

            {updated_at && (
              <ListGroup.Item>
                Last updated on: {dayjs(updated_at).format("ddd | D MMM YYYY")}
              </ListGroup.Item>
            )}
            {created_at && (
              <ListGroup.Item>
                Created on: {dayjs(created_at).format("ddd | D MMM YYYY")}
              </ListGroup.Item>
            )}
            <ListGroupItem>
              <Row>
                <Col className={styles.CreatedBy}>
                  Created by:
                  <Link to={`/profiles/${owner_id}`} className={styles.Avatar}>
                    <Avatar src={owner_image} height={55} />
                    {/* render "me" if logged-in user is viewing their own profile
                  else show first name, last name or both if available
                  otherwise, show username */}
                    {currentUser?.username === owner
                      ? "me"
                      : owner_firstname
                      ? owner_firstname + " " + owner_lastname
                      : owner_lastname
                      ? owner_lastname
                      : owner}
                  </Link>
                </Col>
              </Row>
            </ListGroupItem>
          </ListGroup>

          {image && <Card.Img src={image} alt={title} />}
          <div className={styles.TaskBar}></div>
        </Card.Body>
      )}
    </Card>
  );
};

export default Task;
