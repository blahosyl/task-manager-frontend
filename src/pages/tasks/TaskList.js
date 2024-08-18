import React, { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import { useLocation } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import InfiniteScroll from "react-infinite-scroll-component";

import { fetchMoreData } from "../../utils/utils";
import appStyles from "../../App.module.css";
import styles from "../../styles/TaskList.module.css";
import kanbanStyles from "../../styles/TaskKanban.module.css";
import Task from "./Task";
import Asset from "../../components/Asset";
import NoResults from "../../assets/no-results.png";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Link } from "react-router-dom/cjs/react-router-dom.min";


function TaskList({
  message,
  filter = "",
  taskList,
  tabListChanged,
  setTabListChanged,
}) {
  // Get the task list
  const [tasks, setTasks] = useState({ results: [] });

  const [hasLoaded, setHasLoaded] = useState(false);

  const { pathname } = useLocation();

  const [query, setQuery] = useState("");

  const currentUser = useCurrentUser();
  // const currentUser_id = currentUser?.currentUser_id || "";

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await axiosReq.get(`/tasks/?${filter}search=${query}`);
        setTasks(data);
        setHasLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };

    setHasLoaded(false);
    setTabListChanged(false);
    const timer = setTimeout(() => {
      fetchTasks();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [filter, query, pathname, currentUser, tabListChanged, setTabListChanged])

  return (
    taskList ?
    (<Row className="h-100 mt-3">
      <Col>
        <i className={`fas fa-search ${styles.SearchIcon}`} />
        <Form
          className={styles.SearchBar}
          onSubmit={(event) => event.preventDefault()}
        >
          <Form.Control
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="text"
            className="mr-sm-2"
            placeholder="Search tasks"
          />
        </Form>
        {hasLoaded ? (
          <>
            {tasks.results.length ? (
              <InfiniteScroll
                children={tasks.results.map((task) => (
                  <Task
                    key={task.id}
                    {...task}
                    setTasks={setTasks}
                    taskList={taskList}
                    tabListChanged={tabListChanged}
                    setTabListChanged={setTabListChanged}
                  />
                ))}
                dataLength={tasks.results.length}
                loader={<Asset spinner />}
                hasMore={!!tasks.next}
                endMessage={
                  <p className="text-center text-muted">
                    That's it! You have viewed all tasks that match the criteria
                  </p>
                }
                next={() => fetchMoreData(tasks, setTasks)}
              />
            ) : (
              <Container className={`${appStyles.Content} ${appStyles.Rounded}`}>
                <Asset src={NoResults} message={message} />
              </Container>
            )}
          </>
        ) : (
          <Container className={appStyles.Content}>
            <Asset spinner />
          </Container>
        )}{" "}
      </Col>
    </Row>)
    :
    (<Row className="mt-3">
    <Col>
      <Row>
        <Col className="col-12 col-md-8">
          <i className={`fas fa-search ${styles.SearchIcon}`} />
          <Form
            className={styles.SearchBar}
            onSubmit={(event) => event.preventDefault()}
          >
            <Form.Control
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              type="text"
              className="mr-sm-2"
              placeholder="Search tasks"
            />
          </Form>
        </Col>
        <Col className="d-none d-md-flex col-4 text-right">
          <Link className="align-self-center" to={`/team`}>
            <h3>
              <i className="fa-solid fa-users-line"></i>Teammates
            </h3>
          </Link>
        </Col>
      </Row>
      {hasLoaded ? (
        <>
          {tasks.results.length ? (
            <>
              <div className={`${kanbanStyles.KanbanContainer}`}>
                <div
                  className={`
                    ${kanbanStyles.KanbanColumn}
                    ${appStyles.Rounded}
                  `}
                >
                  <h2 className="text-center">To do</h2>
                  <InfiniteScroll
                    children={tasks.results.map(
                      (task) =>
                        task.status === "TO-DO" && (
                          <Task 
                            key={task.id} {...task} 
                            setTasks={setTasks} 
                            taskList={taskList}
                            tabListChanged={tabListChanged}
                            setTabListChanged={setTabListChanged}
                          />
                        )
                    )}
                    dataLength={tasks.results.length}
                    loader={<Asset spinner />}
                    hasMore={!!tasks.next}
                    endMessage={
                      <p className="text-center text-muted">
                        That's it! You have viewed all tasks to do
                      </p>
                    }
                    next={() => fetchMoreData(tasks, setTasks)}
                  />
                </div>

                <div
                  className={`
                    ${kanbanStyles.KanbanColumn}
                    ${appStyles.Rounded}
                  `}
                >
                  <h2 className="text-center">In progress</h2>
                  <InfiniteScroll
                    children={tasks.results.map(
                      (task) =>
                        task.status === "IN-PROGRESS" && (
                          <Task 
                            key={task.id} {...task} 
                            setTasks={setTasks} 
                            taskList={taskList}
                            tabListChanged={tabListChanged}
                          setTabListChanged={setTabListChanged}
                          />
                        )
                    )}
                    dataLength={tasks.results.length}
                    loader={<Asset spinner />}
                    hasMore={!!tasks.next}
                    endMessage={
                      <p className="text-center text-muted">
                        That's it! You have viewed all tasks in progress
                      </p>
                    }
                    next={() => fetchMoreData(tasks, setTasks)}
                  />
                </div>

                <div
                  className={`
                    ${kanbanStyles.KanbanColumn}
                    ${appStyles.Rounded}
                  `}
                >
                  <h2 className="text-center">Done</h2>
                  <InfiniteScroll
                    children={tasks.results.map(
                      (task) =>
                        task.status === "DONE" && (
                          <Task 
                            key={task.id} {...task} 
                            setTasks={setTasks} 
                            taskList={taskList}
                            tabListChanged={tabListChanged}
                            setTabListChanged={setTabListChanged}
                          />
                        )
                    )}
                    dataLength={tasks.results.length}
                    loader={<Asset spinner />}
                    hasMore={!!tasks.next}
                    endMessage={
                      <p className="text-center text-muted">
                        That's it! You have viewed all completed tasks
                      </p>
                    }
                    next={() => fetchMoreData(tasks, setTasks)}
                  />
                </div>
              </div>
            </>
          ) : (
            <Container className={`${appStyles.Content} ${appStyles.Rounded}`}>
              <Asset src={NoResults} message={message} />
            </Container>
          )}
        </>
      ) : (
        <Container className={`${appStyles.Content} ${appStyles.Rounded}`}>
          <Asset spinner />
        </Container>
      )}{" "}
    </Col>
  </Row>)
  );
}

export default TaskList;
