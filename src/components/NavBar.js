import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import { NavLink } from "react-router-dom";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../contexts/CurrentUserContext";
import Avatar from "./Avatar";
import axios from "axios";

import useClickOutsideToggle from "../hooks/useClickOutsideToggle";
import { removeTokenTimestamp } from "../utils/utils";
import logo from "../assets/logo.jpg";
import styles from "../styles/NavBar.module.css";
import appStyles from "../App.module.css";

/** Render a responsive navbar that is collapsed on small screens */
const NavBar = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  const { expanded, setExpanded, ref } = useClickOutsideToggle();

  /** Remove refresh token timestamp when user signs out */
  const handleSignOut = async () => {
    try {
      await axios.post("dj-rest-auth/logout/");
      setCurrentUser(null);
      removeTokenTimestamp();
    } catch (err) {
    }
  };

  // icons for logged-in users
  const loggedInIcons = (
    <>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/tasks/create"
      >
        <i className="fa-solid fa-plus"></i>Add
      </NavLink>
      <NavLink
        exact
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/"
      >
        <i className="fa-solid fa-table-columns"></i>Kanban
      </NavLink>
      <NavLink
        exact
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/list"
      >
        <i className="fa-solid fa-list-check"></i>List
      </NavLink>
      <NavLink
        exact
        // only show this on small & med screens
        className={`${styles.NavLink} d-lg-none`}
        activeClassName={styles.Active}
        to="/team"
      >
        <i className="fa-solid fa-users-line"></i>Team
      </NavLink>
      <NavLink className={styles.NavLink} to="/" onClick={handleSignOut}>
        <i className="fas fa-sign-out-alt"></i>Sign out
      </NavLink>
      <NavLink
        className={styles.NavLink}
        to={`/profiles/${currentUser?.profile_id}`}
      >
        <Avatar
          src={currentUser?.profile_image}
          text={
            // show first name, last name or both if available
            // otherwise, show username
            currentUser?.profile_firstname
              ? currentUser?.profile_firstname
              : currentUser?.profile_lastname
              ? currentUser?.profile_lastname
              : currentUser?.username
          }
          height={40}
        />
      </NavLink>
    </>
  );

  // icons for logged-out users
  const loggedOutIcons = (
    <>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/signin"
      >
        <i className="fa-solid fa-right-to-bracket"></i>Sign in
      </NavLink>
      <NavLink
        to="/signup"
        className={styles.NavLink}
        activeClassName={styles.Active}
      >
        <i className="fas fa-user-plus"></i>Sign up
      </NavLink>
    </>
  );

  /** Render the navbar */
  return (
    <Navbar
      expanded={expanded}
      className={styles.NavBar}
      expand="lg"
      fixed="top"
    >
      {" "}
      <Container>
        <NavLink to="/">
          <Navbar.Brand>
            <img src={logo} alt="logo" height="45" />
            <span className={`text-uppercase ml-2 ${appStyles.AppName}`}>
              On fire 🔥
            </span>
          </Navbar.Brand>
        </NavLink>

        <Navbar.Toggle
          ref={ref}
          onClick={() => setExpanded(!expanded)}
          aria-controls="basic-navbar-nav"
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto text-left">
            {currentUser ? loggedInIcons : loggedOutIcons}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
