import React, { useEffect, useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import Asset from "../../components/Asset";

import styles from "../../styles/ProfilePage.module.css";
import appStyles from "../../App.module.css";

import ProfileList from "./ProfileList";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import {
  useProfileData,
  useSetProfileData,
} from "../../contexts/ProfileDataContext";
import { Image, Tab, Tabs } from "react-bootstrap";

import { ProfileEditDropdown } from "../../components/MoreDropdown";
import TaskList from "../tasks/TaskList";

function ProfileDetail() {
  const [hasLoaded, setHasLoaded] = useState(false);

  const currentUser = useCurrentUser();
  const { id } = useParams();
  const setProfileData = useSetProfileData();
  const { pageProfile } = useProfileData();
  const [profile] = pageProfile.results;
  const is_owner = currentUser?.username === profile?.owner;

  // track if the watched status of a task has changed
  const [changedWatch, setChangedWatch] = useState(false);

  const [tasks, setTasks] = useState({ results: [] });

  /** Fetch the user's Profile data, refetch when profile id, data or the user's
  watched tasks change (watched tasks counts are fetched from profile, not task)*/
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: pageProfile }] = 
          await Promise.all([
            axiosReq.get(`/profiles/${id}/`),
          ]);
        setProfileData((prevState) => ({
          ...prevState,
          pageProfile: { results: [pageProfile] },
        }));
        setHasLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
    setChangedWatch(false);
  }, [id, setProfileData, changedWatch]);

  const shortname =
    currentUser?.username === profile?.owner
      ? "me"
      : profile?.firstname
      ? profile?.firstname
      : profile?.lastname
      ? profile?.lastname
      : profile?.owner;

  const mainProfile = (
    <>
      <Row noGutters className="px-3 text-center">
        <Col lg={3} className="text-lg-left">
          <Image
            className={styles.ProfileImage}
            roundedCircle
            src={profile?.image}
          />
        </Col>
        <Col lg={6}>
          <h3 className="m-2">
            {/* show first name, last name or both if available
                  otherwise, show username */}
            {profile?.firstname
              ? profile?.firstname + " " + profile?.lastname
              : profile?.lastname
              ? profile?.lastname
              : profile?.owner}
            {/* add " (me)" if logged-in user is viewing their own profile */}
            {currentUser?.username === profile?.owner ? " (me)" : ""}
          </h3>
          <Row className="justify-content-center no-gutters">
            <Col className="my-2">
              {/* show all fields if logged-in user is viewing their own profile */}
              {currentUser?.username === profile?.owner ? (
                <>
                  <div>username: {profile?.owner}</div>
                  <div>First name: {profile?.firstname || "not defined"}</div>
                  <div className="mb-3">
                    Last name: {profile?.lastname || "not defined"}
                  </div>
                  <div>Role: {profile?.role || "not defined"}</div>
                  <div>Pronouns: {profile?.pronouns || "not defined"}</div>
                  <div className="my-3">
                    <h5>About</h5> {profile?.about || "Not filled in"}
                  </div>
                </>
              ) : (
                <>
                  {/* for other user's profiels, show role, pronouns & about info 
                  if available */}
                  {profile?.role && <div>Role: {profile?.role}</div>}
                  {profile?.pronouns && (
                    <div>Pronouns: {profile?.pronouns}</div>
                  )}
                  {profile?.about && (
                    <div className="my-3">
                      <h5>About</h5> {profile?.about || "Not filled in"}
                    </div>
                  )}
                </>
              )}
            </Col>
          </Row>
        </Col>
        <Col lg={3} className="text-lg-right">
          {/* show edit placeholder if signed in user is owner of the profile */}
          {currentUser && is_owner && <ProfileEditDropdown id={profile?.id} />}
        </Col>
        {profile?.content && <Col className="p-3">{profile.content}</Col>}
      </Row>
    </>
  );

  //   tasks assigned to viewed profile
  const mainProfileTasks = (
    <>
      <hr />
      <Row className="h-100">
        <Col className="py-2 p-0 p-lg-2">
          <h4 className="text-center mb-3">Tasks</h4>
          <Tabs defaultActiveKey="assigned" id="profile-task-tabs">
            <Tab
              eventKey="assigned"
              title={`
                Assigned to
                ${shortname}
                ${profile ? ("(" + profile.assigned_count) + ")": ""}

              `}
            >
              <TaskList
                message="No results found. Adjust the search keyword assign a task to yourself."
                filter={`assignee__profile=${profile?.id}&ordering=-updated_at&`}
                taskList
                tasks={tasks}
                setTasks={setTasks}
                // changedWatch={changedWatch}
                setChangedWatch={setChangedWatch}


              />
            </Tab>
            <Tab 
              eventKey="watched" 
              title={`
                Watched by
                ${shortname}
                ${profile ? ("(" + profile.watched_count) + ")": ""}

              `}
            >
              <TaskList
                message="No results found. Adjust the search keyword or watch a task."
                filter={`watched__owner__profile=${profile?.id}&ordering=-watchers__created_at&`}
                taskList
                tasks={tasks}
                setTasks={setTasks}
                changedWatch={changedWatch}
                setChangedWatch={setChangedWatch}

              />
            </Tab>
            <Tab 
              eventKey="created" 
              title={`
                Created by
                ${shortname}
                ${profile ? ("(" + profile.owned_count) + ")": ""}

              `}            
            >
              <TaskList
                message="No results found. Adjust the search keyword or create a task."
                filter={`owner__profile=${profile?.id}&ordering=-created_at&`}
                taskList
                tasks={tasks}
                setTasks={setTasks}
                // changedWatch={changedWatch}
                setChangedWatch={setChangedWatch}

              />
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </>
  );

  return (
    <Row>
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <Container className={appStyles.Content}>
          {hasLoaded ? (
            <>
              {mainProfile}
              {mainProfileTasks}
            </>
          ) : (
            <Asset spinner />
          )}
        </Container>
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        <ProfileList />
      </Col>
    </Row>
  );
}

export default ProfileDetail;
