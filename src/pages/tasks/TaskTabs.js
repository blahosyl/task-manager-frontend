import React, { useEffect, useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import { axiosReq } from "../../api/axiosDefaults";
import { useRedirect } from "../../hooks/useRedirect";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import {
  useProfileData,
  useSetProfileData,
} from "../../contexts/ProfileDataContext";

import TaskList from "./TaskList";
import ProfileList from "../profiles/ProfileList";

/** Render task list/Kanban in a filtered tab format:
 * assigned to/watched by/created by logged-in user
 * + all tasks
 * Profile List is rendered next to task list (but not Kanban board)
 */
function TaskTabs(props) {
  // redirect logged-out users
  useRedirect("loggedOut");

  const { taskList } = props;

  const [tasks, setTasks] = useState({ results: [] });

  // track if the watched status of a task has changed or a task has been deleted
  const [tabListChanged, setTabListChanged] = useState(false);

  const currentUser = useCurrentUser();
  const currentUser_id = currentUser?.profile_id || "";

  const id = currentUser_id;
  const setProfileData = useSetProfileData();
  const { pageProfile } = useProfileData();
  const [profile] = pageProfile.results;

  useEffect(() => {
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
      }
    };
    fetchData();
  }, [id, setProfileData, taskList, tabListChanged]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2">
        <Tabs defaultActiveKey="assigned" id="task-tabs">
          <Tab
            eventKey="assigned"
            title={`
              Assigned to me
              ${profile ? "(" + profile.assigned_count + ")" : ""}
            `}
          >
            <TaskList
              taskList={taskList}
              message="No results found. Adjust the search keyword assign a task to yourself."
              filter={`assignee__profile=${currentUser_id}&ordering=-updated_at&`}
              tasks={tasks}
              setTasks={setTasks}
              tabListChanged={tabListChanged}
              setTabListChanged={setTabListChanged}
            />
          </Tab>
          <Tab
            eventKey="Watched by me"
            title={`
              Watched by me
              ${profile ? "(" + profile.watched_count + ")" : ""}
            `}
          >
            <TaskList
              taskList={taskList}
              message="No results found. Adjust the search keyword or watch a task."
              filter={`watched__owner__profile=${currentUser_id}&ordering=-watchers__created_at&`}
              tasks={tasks}
              setTasks={setTasks}
              tabListChanged={tabListChanged}
              setTabListChanged={setTabListChanged}
            />
          </Tab>
          <Tab
            eventKey="Created by me"
            title={`
              Created by me
              ${profile ? "(" + profile.owned_count + ")" : ""}
            `}
          >
            <TaskList
              taskList={taskList}
              message="No results found. Adjust the search keyword or create a task."
              filter={`owner__profile=${currentUser_id}&ordering=-created_at&`}
              tasks={tasks}
              setTasks={setTasks}
              tabListChanged={tabListChanged}
              setTabListChanged={setTabListChanged}
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
              tabListChanged={tabListChanged}
              setTabListChanged={setTabListChanged}
            />
          </Tab>
        </Tabs>
      </Col>
      {/* render profile list if task list format is used */}
      {taskList && (
        <Col md={4} className="d-none d-lg-block p-0 p-lg-2">
          <ProfileList />
        </Col>
      )}
    </Row>
  );
}

export default TaskTabs;
