import React, { useEffect, useState } from "react";
import TaskList from "./TaskList";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import {
  useProfileData,
  useSetProfileData,
} from "../../contexts/ProfileDataContext";

import { Col, Row, Tab, Tabs } from "react-bootstrap";
import ProfileList from "../profiles/ProfileList";

import { axiosReq } from "../../api/axiosDefaults";
import { useRedirect } from "../../hooks/useRedirect";

function TaskTabs(props) {
  // redirect logged-out users
  useRedirect("loggedOut");

  const {
    taskList
  } = props;

  const [tasks, setTasks] = useState({ results: [] });

  // track if the watched status of a task has changed
  const [changedWatch, setChangedWatch] = useState(false);
  
  const currentUser = useCurrentUser();
  const profile_id = currentUser?.profile_id || "";

  const id  = profile_id
  const setProfileData = useSetProfileData();
  const { pageProfile } = useProfileData();
  const [profile] = pageProfile.results;

  useEffect(() => {
    console.log("component rendered")
    const fetchData = async () => {
      try {
        const [{ data: pageProfile }] = await Promise.all([
          axiosReq.get(`/profiles/${id}/`),
          // axiosReq.get(`/tasks/?owner__profile=${id}`),
        ]);
        setProfileData((prevState) => ({
          ...prevState,
          pageProfile: { results: [pageProfile] },
        }));
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [id, setProfileData,taskList]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2">
        <Tabs defaultActiveKey="assigned" id="task-tabs">
          <Tab 
            eventKey="assigned" 
            title={`
              Assigned to me
              ${profile ? ("(" + profile.assigned_count) + ")": ""}
            `}
          >
            <TaskList
              taskList={taskList}
              message="No results found. Adjust the search keyword assign a task to yourself."
              filter={`assignee__profile=${profile_id}&ordering=-updated_at&`}
              tasks={tasks}
              setTasks={setTasks}
              changedWatch={changedWatch}
              setChangedWatch={setChangedWatch}
            />
          </Tab>
          <Tab 
            eventKey="Watched by me" 
            title={`
              Watched by me
              ${profile ? ("(" + profile.watched_count) + ")": ""}
            `}
          >
            <TaskList
              taskList={taskList}
              message="No results found. Adjust the search keyword or watch a task."
              filter={`watched__owner__profile=${profile_id}&ordering=-watchers__created_at&`}
              tasks={tasks}
              setTasks={setTasks}
              changedWatch={changedWatch}
              setChangedWatch={setChangedWatch}
            />
          </Tab>
          <Tab 
            eventKey="Created by me" 
            title={`
              Created by me
              ${profile ? ("(" + profile.owned_count) + ")": ""}
            `}
          >
            <TaskList
              taskList={taskList}
              message="No results found. Adjust the search keyword or create a task."
              filter={`owner__profile=${profile_id}&ordering=-created_at&`}
              tasks={tasks}
              setTasks={setTasks}
              changedWatch={changedWatch}
              setChangedWatch={setChangedWatch}
            />
          </Tab>
          <Tab 
            eventKey="All" 
            title={`
              All tasks
            `}
          >
            <TaskList 
              taskList={taskList}
              message="No results found. Adjust the search keyword."
              tasks={tasks}
              setTasks={setTasks}
              changedWatch={changedWatch}
              setChangedWatch={setChangedWatch}
            />
          </Tab>
        </Tabs>
      </Col>
      {taskList && (<Col md={4} className="d-none d-lg-block p-0 p-lg-2">
        <ProfileList />
      </Col>)}
    </Row>
  );
}

export default TaskTabs;
