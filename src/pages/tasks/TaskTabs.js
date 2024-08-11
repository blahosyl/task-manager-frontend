import React from "react";
import TaskList from "./TaskList";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Col, Row, Tab, Tabs } from "react-bootstrap";
import ProfileList from "../profiles/ProfileList";
import TaskKanban from "./TaskKanban";

function TaskTabs() {
  const list = false;
  const TaskComponent = list ? TaskList : TaskKanban
  const currentUser = useCurrentUser();
  const profile_id = currentUser?.profile_id || "";
  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2">
        <Tabs defaultActiveKey="assigned" id="task-tabs">
          <Tab eventKey="assigned" title="Assigned to me">
            <TaskComponent
              message="No results found. Adjust the search keyword assign a task to yourself."
              filter={`assignee__profile=${profile_id}&ordering=-updated_at&`}
            />
          </Tab>
          <Tab eventKey="Watched by me" title="Watched by me">
            <TaskComponent
              message="No results found. Adjust the search keyword or watch a task."
              filter={`watched__owner__profile=${profile_id}&ordering=-watchers__created_at&`}
            />
          </Tab>
          <Tab eventKey="Created by me" title="Created by me">
            <TaskComponent
              message="No results found. Adjust the search keyword or create a task."
              filter={`owner__profile=${profile_id}&ordering=-created_at&`}
            />
          </Tab>
          <Tab eventKey="All" title="All">
            <TaskList message="No results found. Adjust the search keyword." />
          </Tab>
        </Tabs>
      </Col>
      {list && (<Col md={4} className="d-none d-lg-block p-0 p-lg-2">
        <ProfileList />
      </Col>)}
    </Row>
  );
}

export default TaskTabs;
