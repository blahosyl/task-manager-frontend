import React, { useEffect, useState } from "react";

import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import styles from "../../styles/ProfileDetail.module.css";
import appStyles from "../../App.module.css";

import { useCurrentUser } from "../../contexts/CurrentUserContext";
import {
  useProfileData,
  useSetProfileData,
} from "../../contexts/ProfileDataContext";
import ProfileList from "./ProfileList";
import TaskList from "../tasks/TaskList";
import Asset from "../../components/Asset";
import { ProfileEditDropdown } from "../../components/MoreDropdown";

/** Render the profile detail page for logged-in users
 * Include profile data & tasks related to profile
 * (assigned to, watched by or owned/created by)
 * When the user is viewing their own profile, the tasks in each column refresh
 * when they watch/unwatch a task
 * For the logged-in user, the profile/user edit dropdown is available from this page
 */
function ProfileDetail() {
  const [hasLoaded, setHasLoaded] = useState(false);

  const currentUser = useCurrentUser();
  const { id } = useParams();
  const setProfileData = useSetProfileData();
  const { pageProfile } = useProfileData();
  const [profile] = pageProfile.results;
  const is_owner = currentUser?.username === profile?.owner;

  // track if the watched status of a task has changed
  // (or if it has been deleted – irrelevant here)
  const [tabListChanged, setTabListChanged] = useState(false);

  const [tasks, setTasks] = useState({ results: [] });

  /** Fetch the user's Profile data, refetch when profile id, data or the user's
  watched tasks change (watched tasks counts are fetched from profile, not task)
  Technically, deleting a task would also trigger this, but this never happens, 
  as the user is redirected to the home page after deletion*/
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: pageProfile }] = await Promise.all([
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
  }, [id, setProfileData, tabListChanged]);

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
            alt="Profile image"
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
                  <div>
                    <span className="font-italic">username: </span>
                    {profile?.owner}
                  </div>
                  <div>
                    <span className="font-italic">First name: </span>
                    {profile?.firstname || "not defined"}
                  </div>
                  <div className="mb-3">
                    <span className="font-italic">Last name: </span>
                    {profile?.lastname || "not defined"}
                  </div>
                  <div>
                    <span className="font-italic">Role: </span>
                    {profile?.role || "not defined"}
                  </div>
                  <div>
                    <span className="font-italic">Pronouns: </span>
                    {profile?.pronouns || "not defined"}
                  </div>
                  <div className="my-3">
                    <p className="font-italic">About:</p>{" "}
                    {profile?.about || "Not filled in"}
                  </div>
                </>
              ) : (
                <>
                  {/* for other user's profiles, show role, pronouns & about info 
                  if available */}
                  {profile?.role && (
                    <div>
                      <span className="font-italic">Role: </span>
                      {profile?.role}
                    </div>
                  )}
                  {profile?.pronouns && (
                    <div>
                      <span className="font-italic">Pronouns: </span>
                      {profile?.pronouns}
                    </div>
                  )}
                  {profile?.about && (
                    <div className="my-3">
                      <p className="font-italic">About:</p>{" "}
                      {profile?.about || "Not filled in"}
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

  //tasks related to viewed profile
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
                ${profile ? "(" + profile.assigned_count + ")" : ""}

              `}
            >
              <TaskList
                message="No results found. Adjust the search keyword assign a task to yourself."
                filter={`assignee__profile=${profile?.id}&ordering=-updated_at&`}
                taskList
                tasks={tasks}
                setTasks={setTasks}
                tabListChanged={tabListChanged}
                setTabListChanged={setTabListChanged}
              />
            </Tab>
            <Tab
              eventKey="watched"
              title={`
                Watched by
                ${shortname}
                ${profile ? "(" + profile.watched_count + ")" : ""}

              `}
            >
              <TaskList
                message="No results found. Adjust the search keyword or watch a task."
                filter={`watched__owner__profile=${profile?.id}&ordering=-watchers__created_at&`}
                taskList
                tasks={tasks}
                setTasks={setTasks}
                tabListChanged={tabListChanged}
                setTabListChanged={setTabListChanged}
              />
            </Tab>
            <Tab
              eventKey="created"
              title={`
                Created by
                ${shortname}
                ${profile ? "(" + profile.owned_count + ")" : ""}

              `}
            >
              <TaskList
                message="No results found. Adjust the search keyword or create a task."
                filter={`owner__profile=${profile?.id}&ordering=-created_at&`}
                taskList
                tasks={tasks}
                setTasks={setTasks}
                tabListChanged={tabListChanged}
                setTabListChanged={setTabListChanged}
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
        <Container className={`${appStyles.Content} ${appStyles.Rounded}`}>
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
