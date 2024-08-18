import React, { useEffect, useState } from "react";

import InfiniteScroll from "react-infinite-scroll-component";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";

import appStyles from "../../App.module.css";

import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { fetchMoreData } from "../../utils/utils";
import { useRedirect } from "../../hooks/useRedirect";

import Task from "./Task";
import ProfileList from "../profiles/ProfileList";
import Comment from "../comments/Comment";
import CommentCreateForm from "../comments/CommentCreateForm";
import NotFound from "../../components/NotFound";
import Asset from "../../components/Asset";

/** Render task detail page with Teammates on the right on large screens */
function TaskDetail() {
  // redirect logged-out users
  useRedirect("loggedOut");

  const { id } = useParams();
  const [task, setTask] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);

  const currentUser = useCurrentUser();

  const profile_image = currentUser?.profile_image;

  const [comments, setComments] = useState({ results: [] });

  /** Get task and comment data */
  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{ data: task }, { data: comments }] = await Promise.all([
          axiosReq.get(`/tasks/${id}`),
          axiosReq.get(`/comments/?task=${id}`),
        ]);
        setTask({ results: [task] });
        setComments(comments);
        setHasLoaded(true);
        console.log(task);
        console.log("hasLoaded", hasLoaded);
      } catch (err) {
        console.log(err);
      }
    };

    handleMount();
  }, [id, hasLoaded, setHasLoaded]);

  return hasLoaded ? (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        {/* render task details */}
        <Task {...task.results[0]} setTasks={setTask} taskDetail />
        {/* render comment create form */}
        <Container className={`${appStyles.Content} ${appStyles.Rounded}`}>
          {currentUser && (
            <CommentCreateForm
              profile_id={currentUser.profile_id}
              profileImage={profile_image}
              task={id}
              setTask={setTask}
              setComments={setComments}
            />
          )}
          {/* render "comments" header if there are any comments */}
          {comments.results.length ? (
            <h5 className="ml-3">
              {comments.results.length} comment{comments.results.length !== 1 &&"s"}
            </h5>
          ) : null}
          {/* render task comments if any */}
          {comments.results.length ? (
            <>
              <InfiniteScroll
                children={comments.results.map((comment) => (
                  <Comment
                    key={comment.id}
                    {...comment}
                    setTask={setTask}
                    setComments={setComments}
                    priority={task.priority}
                  />
                ))}
                dataLength={comments.results.length}
                loader={<Asset spinner />}
                hasMore={!!comments.next}
                next={() => fetchMoreData(comments, setComments)}
              />
            </>
          ) : 
            <p className="text-center pt-2">No comments (yet)</p>
        }
        </Container>
      </Col>
      <Col md={4} className="d-none d-lg-block p-0 p-lg-2">
        <ProfileList />
      </Col>
    </Row>
  ) : (
    <NotFound />
  );
}

export default TaskDetail;
