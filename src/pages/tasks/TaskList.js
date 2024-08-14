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
import Task from "./Task";
import Asset from "../../components/Asset";
import NoResults from "../../assets/no-results.png";
// import ProfileList from "../profiles/ProfileList";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

function TaskList({ message, filter = "" , taskList, changedWatch, setChangedWatch}) {
  const [tasks, setTasks] = useState({ results: [] });

  const [hasLoaded, setHasLoaded] = useState(false);

  const { pathname } = useLocation();

  const [query, setQuery] = useState("");

  const currentUser = useCurrentUser();

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
    setChangedWatch(false);
    const timer = setTimeout(() => {
      fetchTasks();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [filter, query, pathname, currentUser, changedWatch, setChangedWatch]);

  return (
    <Row className="h-100 mt-3">
      <Col >
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
                    key={task.id} {...task} 
                    setTasks={setTasks} 
                    taskList={taskList}
                    changedWatch={changedWatch}
                    setChangedWatch={setChangedWatch}
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
              <Container className={appStyles.Content}>
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
      {/* <Col md={4} className="d-none d-lg-block p-0 p-lg-2">
        <ProfileList />
      </Col> */}
    </Row>
  );
}

export default TaskList;
