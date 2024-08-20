import React, { useState } from "react";
import { Link } from "react-router-dom";

// notification messages
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import styles from "../../styles/CommentCreateEditForm.module.css";
import btnStyles from "../../styles/Button.module.css";

import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";

/** Handle creating a new comment for logged-in users */
function CommentCreateForm(props) {
  const { task, setTask, setComments, profileImage, profile_id } = props;
  const [content, setContent] = useState("");

  const handleChange = (event) => {
    setContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axiosRes.post("/comments/", {
        content,
        task,
      });
      setComments((prevComments) => ({
        ...prevComments,
        results: [data, ...prevComments.results],
      }));
      setTask((prevTask) => ({
        results: [
          {
            ...prevTask.results[0],
            comments_count: prevTask.results[0].comments_count + 1,
          },
        ],
      }));
      setContent("");
    } catch (err) {
    }
  };

  // feedback message for user CRUD
  const commentCreateSuccessMsg = () => {
    toast.success("You have successfully commented on this task 🎉");
  };

  return (
    <Form className="mt-2" onSubmit={handleSubmit}>
      <Form.Group>
        <InputGroup>
          <Link to={`/profiles/${profile_id}`}>
            <Avatar src={profileImage} />
          </Link>
          <Form.Control
            className={styles.Form}
            placeholder="write a comment"
            as="textarea"
            value={content}
            onChange={handleChange}
            rows={2}
          />
        </InputGroup>
      </Form.Group>
      <button
        className={`${styles.Button} ${btnStyles.Blue} btn d-block ml-auto`}
        disabled={!content.trim()}
        type="submit"
        onClick={() => {
          // comment success message
          commentCreateSuccessMsg();
        }}
      >
        comment
      </button>
    </Form>
  );
}

export default CommentCreateForm;
