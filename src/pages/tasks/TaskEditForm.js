import React, { useRef, useState, useEffect } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";

import Upload from "../../assets/upload.png";

import styles from "../../styles/TaskCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import { useHistory } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import { useRedirect } from "../../hooks/useRedirect";

import { useCurrentUser } from "../../contexts/CurrentUserContext";

import Asset from "../../components/Asset";
import Image from "react-bootstrap/Image";
import TaskForm from "./TaskForm";

function TaskEditForm() {
 

  return (
    <TaskForm editForm/>
  );
}

export default TaskEditForm;
