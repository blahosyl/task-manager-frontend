import React, { useState } from "react";
import { Media } from "react-bootstrap";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { MoreDropdown } from "../../components/MoreDropdown";
import CommentEditForm from "./CommentEditForm";

import styles from "../../styles/Comment.module.css";
import taskStyles from "../../styles/Task.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { axiosRes } from "../../api/axiosDefaults";

const Comment = (props) => {
  const {
    profile_id,
    profile_image,
    owner,
    owner_firstname,
    owner_lastname,
    updated_at,
    content,
    id,
    setTask,
    setComments,
    priority,
  } = props;

  const [showEditForm, setShowEditForm] = useState(false);
  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/comments/${id}/`);
      setTask((prevTask) => ({
        results: [
          {
            ...prevTask.results[0],
            comments_count: prevTask.results[0].comments_count - 1,
          },
        ],
      }));

      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.filter((comment) => comment.id !== id),
      }));
    } catch (err) {}
  };

  return (
    <>
      <hr />
      <Media>
        <Link to={`/profiles/${profile_id}`}>
          <Avatar 
            src={profile_image} 
          />
        </Link>
        <Media.Body className="align-self-center ml-2">
          <span className={`
            ${styles.Owner}
            ${
              priority === String("LOW")
                ? taskStyles.VeryDarkLowText
                : priority === String("MEDIUM")
                ? taskStyles.VeryDarkMedText
                : priority === String("HIGH")
                ? taskStyles.VeryDarkHighText
                : {}
              }
          `}>
          {
            // show first name, last name or both if available
            // otherwise, show username
            owner_firstname
            ? owner_firstname + " " + owner_lastname
            : owner_lastname
            ? owner_lastname
            : owner
                +
                // add "me" to the current user's name in the dropdown
                currentUser?.username === profile_id.owner
                ? " (me)"
                : ""
              }
          </span>
          <span className={styles.Date}>{updated_at}</span>
          {showEditForm ? (
            <CommentEditForm
              id={id}
              profile_id={profile_id}
              content={content}
              profileImage={profile_image}
              setComments={setComments}
              setShowEditForm={setShowEditForm}
            />
          ) : (
            <p>{content}</p>
          )}
        </Media.Body>
        {is_owner && !showEditForm && (
          <MoreDropdown
            handleEdit={() => setShowEditForm(true)}
            handleDelete={handleDelete}
          />
        )}
      </Media>
    </>
  );
};

export default Comment;