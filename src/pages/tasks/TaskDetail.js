import React, { useEffect, useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
// import Container from "react-bootstrap/Container";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";

// import appStyles from "../../App.module.css";
import Task from "./Task";
import ProfileList from "../profiles/ProfileList";
import NotFound from "../../components/NotFound";

function TaskDetail() {
    const { id } = useParams();
    const [task, setTask] = useState({ results: [] });
    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        const handleMount = async () => {
          try {
            const [{ data: task }] = await Promise.all([
              axiosReq.get(`/tasks/${id}`),
            ]);
            setTask({ results: [task] });
            setHasLoaded(true);
            console.log(task);
            console.log('hasLoaded', hasLoaded)
          } catch (err) {
            console.log(err);
          }
        };
    
        handleMount();
      }, [id, hasLoaded, setHasLoaded]);

  return (
    hasLoaded 
    ? <Row className="h-100">
        <Col className="py-2 p-0 p-lg-2" lg={8}>
          <Task {...task.results[0]} setTasks={setTask} taskDetail/>
          {/* <Container className={appStyles.Content}>
            Comments
          </Container> */}
        </Col>
        <Col md={4} className="d-none d-lg-block p-0 p-lg-2">
          <ProfileList />
        </Col>
      </Row>
      : <NotFound />
  );
}

export default TaskDetail;