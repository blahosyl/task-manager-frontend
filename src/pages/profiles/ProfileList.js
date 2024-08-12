import React, { useState } from "react";
import Container from "react-bootstrap/Container";

import appStyles from "../../App.module.css";
import styles from "../../styles/ProfileList.module.css";
import taskStyles from "../../styles/TaskList.module.css";
import Asset from "../../components/Asset";
import {
  useProfileData,
  useSetProfileData,
} from "../../contexts/ProfileDataContext";
import Profile from "./Profile";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import InfiniteScroll from "react-infinite-scroll-component";
import { axiosReq } from "../../api/axiosDefaults";
import { Form } from "react-bootstrap";

/**
 * Render the list of profiles from most to least recently updated
 */
const ProfileList = (props) => {
  // render full-page Profile List
  const { full } = props;

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");

  // get data from ProfielDataContext
  const { profileList } = useProfileData(filter, query);

  // constant by John Rearden
  const setProfileData = useSetProfileData(filter, query);

  // get current user from CurrentUserContext
  const currentUser = useCurrentUser();

  return (
    // only render the component if a user is logged in
    currentUser && (
      <Container
        className={`
          ${appStyles.Content}          
          ${styles.Container}
        `} 
      >

        {/* if profiles are loaded, render them using the Profile component */}
        {profileList.results.length ? (
          <>
            <Link className="align-self-center" to={`/team`}>
              <h3>
                <i className="fa-solid fa-users-line"></i>Teammates
              </h3>
            </Link>

          {/* search bar */}
          <i className={`fas fa-search ${taskStyles.SearchIcon}`} />
          <Form
            className={taskStyles.SearchBar}
            onSubmit={(event) => {
              event.preventDefault();
              setProfileData(query);
            }}
          >
            <Form.Control
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              type="text"
              className="mr-sm-2"
              placeholder="Search profiles"
            />
          </Form>

            <InfiniteScroll
              children={profileList.results.map(
                (profile) =>
                  profile &&
                  /* list of users excluding the logged-in user */
                  Number(profile.id) !== Number(currentUser.pk) && (
                    <Profile
                      key={profile.id}
                      profile={profile}
                      full={full}
                      // `setProfileData` by John Rearden
                      setProfileData={setProfileData}
                    />
                  )
              )}
              dataLength={profileList.results.length}
              loader={<Asset spinner />}
              hasMore={!!profileList.next}
              endMessage={
                <span className="text-muted">
                  That's it! You have viewed all teammates
                </span>
              }
              // function in `next` by John Rearden
              next={async () => {
                try {
                  const { data } = await axiosReq.get(profileList.next);
                  setProfileData((prev) => ({
                    ...prev,
                    profileList: {
                      next: data.next,
                      results: [...prev.profileList.results, ...data.results],
                    },
                  }));
                } catch (err) {
                  console.log(err);
                }
              }}
            />
          </>
        ) : (
          // indicate if component is still loading
          <Asset spinner />
        )}
      </Container>
    )
  );
};

export default ProfileList;
