import React, { useState } from "react";

import { Link } from "react-router-dom";

// notification messages
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Media from "react-bootstrap/Media";

import styles from "../../styles/Comment.module.css";

import Avatar from "../../components/Avatar";
import { MoreDropdownDark } from "../../components/MoreDropdown";
import CommentEditForm from "./CommentEditForm";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { axiosRes } from "../../api/axiosDefaults";

/**  Render the comment object & handle comment deletion */
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
  } = props;

  const [showEditForm, setShowEditForm] = useState(false);
  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

  // feedback message for user CRUD
  const commentDeleteSuccessMsg = () => {
    toast.success("You have successfully deleted your comment 🎉");
  };

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
      commentDeleteSuccessMsg();
    } catch (err) {}
  };

  return (
    <>
      <hr />

      <Media>
        <Link to={`/profiles/${profile_id}`}>
          <Avatar src={profile_image} />
        </Link>
        <Media.Body className="align-self-center ml-2">
          <span
            className={`
            ${styles.Owner}
          `}
          >
            {
              // show first name, last name or both if available
              // otherwise, show username
              owner_firstname
                ? owner_firstname + " " + owner_lastname
                : owner_lastname
                ? owner_lastname
                : owner +
                    // add "me" to the current user's name in the dropdown
                    currentUser?.username ===
                  profile_id.owner
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
          <MoreDropdownDark
            handleEdit={() => setShowEditForm(true)}
            handleDelete={handleDelete}
          />
        )}
      </Media>
    </>
  );
};

export default Comment;
