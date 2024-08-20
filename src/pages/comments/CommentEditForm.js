import React, { useState } from "react";

// notification messages
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { axiosRes } from "../../api/axiosDefaults";

import Form from "react-bootstrap/Form";

import styles from "../../styles/CommentCreateEditForm.module.css";
import btnStyles from "../../styles/Button.module.css";

/** Handle editing (own) comments for logged-in users
 * Fetches the existing content of the comment
 */
function CommentEditForm(props) {
  const { id, content, setShowEditForm, setComments } = props;

  const [formContent, setFormContent] = useState(content);

  const handleChange = (event) => {
    setFormContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosRes.put(`/comments/${id}/`, {
        content: formContent.trim(),
      });
      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.map((comment) => {
          return comment.id === id
            ? {
                ...comment,
                content: formContent.trim(),
                updated_at: "now",
              }
            : comment;
        }),
      }));
      setShowEditForm(false);
    } catch (err) {
    }
  };

  // feedback messages for user CRUD
  const commentEditSuccessMsg = () => {
    toast.success("You have successfully edited your comment 🎉");
  };
  
  const commentEditCancelMsg = () => {
    toast.success("You chose not to edit the comment 👍");
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="pr-1">
        <Form.Control
          className={styles.Form}
          as="textarea"
          value={formContent}
          onChange={handleChange}
          rows={2}
        />
      </Form.Group>
      <div className="text-right">
        <button
          className={`${btnStyles.Button} ${btnStyles.BlueOutline}`}
          onClick={() => {
            setShowEditForm(false);
            commentEditCancelMsg();
          }}
          type="button"
        >
          cancel
        </button>
        <button
          className={`${btnStyles.Button} ${btnStyles.Blue}`}
          disabled={!content.trim()}
          type="submit"
          onClick={() => {
            // comment success message
            commentEditSuccessMsg();
          }}
        >
          save
        </button>
      </div>
    </Form>
  );
}

export default CommentEditForm;
