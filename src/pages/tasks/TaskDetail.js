import React, { useEffect, useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";

import appStyles from "../../App.module.css";
import Task from "./Task";
import ProfileList from "../profiles/ProfileList";
import NotFound from "../../components/NotFound";

import Comment from "../comments/Comment";

import CommentCreateForm from "../comments/CommentCreateForm";

import { useCurrentUser } from "../../contexts/CurrentUserContext";

import InfiniteScroll from "react-infinite-scroll-component";

import Asset from "../../components/Asset";

import { fetchMoreData } from "../../utils/utils";

function TaskDetail() {
  const { id } = useParams();
  const [task, setTask] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);

  const currentUser = useCurrentUser();

  const profile_image = currentUser?.profile_image;

  const [comments, setComments] = useState({ results: [] });

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
        <Task {...task.results[0]} setTasks={setTask} taskDetail />
        <Container className={appStyles.Content}>
          {currentUser ? (
            <CommentCreateForm
              profile_id={currentUser.profile_id}
              profileImage={profile_image}
              task={id}
              setTask={setTask}
              setComments={setComments}
            />
          ) : comments.results.length ? (
            "Comments"
          ) : null}

          {comments.results.length ? (
            <InfiniteScroll
              children={comments.results.map((comment) => (
                <Comment
                  key={comment.id}
                  {...comment}
                  setTask={setTask}
                  setComments={setComments}
                />
              ))}
              dataLength={comments.results.length}
              loader={<Asset spinner />}
              hasMore={!!comments.next}
              next={() => fetchMoreData(comments, setComments)}
            />
          ) : currentUser ? (
            <span>No comments yet, be the first to comment!</span>
          ) : (
            <span>No comments... yet</span>
          )}
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
