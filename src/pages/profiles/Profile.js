import React from "react";
import styles from "../../styles/Profile.module.css";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";

/**
 * Renders a clickable list of users with profile pic & name
 */
const Profile = (props) => {
  const { profile, imageSize = 55 } = props;
  const { id, image, owner, firstname, lastname, role, pronouns } = profile;
  const { full } = props;

  return (
    // whole unit of profile pic + name is clickable
    <Link className="align-self-center" to={`/profiles/${id}`}>
      <div
        className={`my-3 d-flex align-items-center`}
      >
        {/* profile pic */}
        <div>
          <Avatar src={image} height={imageSize} />
        </div>
        {/* profile name */}
        <div className={`mx-2 ${styles.WordBreak}`}>
          {/* show first name, last name or both if available
                  otherwise, show username */}
          <strong>
            {firstname
              ? firstname + " " + lastname
              : lastname
              ? lastname
              : owner}
          </strong>
          {full && pronouns && (" (")}
          {full && pronouns && (pronouns)}
          {full && pronouns && (")")}
          {full && role && (" ")}
          {full && role && (role)}
        </div>
      </div>
    </Link>
  );
};

export default Profile;
