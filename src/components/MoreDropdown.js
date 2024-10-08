import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { useHistory } from "react-router";

import appStyles from "../App.module.css";
import styles from "../styles/MoreDropdown.module.css";

// Light vertical dots icon for dark background
// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
const ThreeDots = React.forwardRef(({ onClick }, ref) => (
  <i
    className="fa-solid fa-ellipsis-vertical text-white"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  />
));

// Dark vertical dots icon for light background
// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
const ThreeDotsDark = React.forwardRef(({ onClick }, ref) => (
  <i
    className={`fa-solid fa-ellipsis-vertical ${appStyles.DarkIcon}`}
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  />
));

// Dark pencil icon for light background
// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
const PencilDark = React.forwardRef(({ onClick }, ref) => (
  <i
    className={`fa-solid fa-pencil ${appStyles.DarkIcon}`}
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  />
));

/** white edit/delete dropdown for dark backgrounds */ 
export const MoreDropdown = ({ handleEdit, handleDelete }) => {
  return (
    <Dropdown className="ml-auto" drop="left">
      <Dropdown.Toggle as={ThreeDots} />

      <Dropdown.Menu
        className="text-center"
        popperConfig={{ strategy: "fixed" }}
      >
        <Dropdown.Item
          className={styles.DropdownItem}
          onClick={handleEdit}
          aria-label="edit"
        >
          <i className={`fas fa-edit ${appStyles.DarkIcon}`} />
        </Dropdown.Item>
        <Dropdown.Item
          className={styles.DropdownItem}
          onClick={handleDelete}
          aria-label="delete"
        >
          <i className={`fas fa-trash-alt ${appStyles.DarkIcon}`} />
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

/** dark edit/delete dropown for light backgrounds  */ 
export const MoreDropdownDark = ({ handleEdit, handleDelete }) => {
  return (
    <Dropdown className="ml-auto" drop="left">
      <Dropdown.Toggle as={ThreeDotsDark} />

      <Dropdown.Menu
        className="text-center"
        popperConfig={{ strategy: "fixed" }}
      >
        <Dropdown.Item
          className={styles.DropdownItem}
          onClick={handleEdit}
          aria-label="edit"
        >
          <i className={`fas fa-edit ${appStyles.DarkIcon}`} />
        </Dropdown.Item>
        <Dropdown.Item
          className={styles.DropdownItem}
          onClick={handleDelete}
          aria-label="delete"
        >
          <i className={`fas fa-trash-alt ${appStyles.DarkIcon}`} />
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

/** dark profile/user edit dropown for light backgrounds  */ 
export const ProfileEditDropdown = ({ id }) => {
  const history = useHistory();
  return (
    <Dropdown className={`ml-auto px-3 ${styles.Absolute}`} drop="left">
      <Dropdown.Toggle as={PencilDark} />
      <Dropdown.Menu>
        <Dropdown.Item
          onClick={() => history.push(`/profiles/${id}/edit`)}
          aria-label="edit-profile"
        >
          <i className="fas fa-edit" /> edit profile
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => history.push(`/profiles/${id}/edit/username`)}
          aria-label="edit-username"
        >
          <i className="far fa-id-card" />
          change username
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => history.push(`/profiles/${id}/edit/password`)}
          aria-label="edit-password"
        >
          <i className="fas fa-key" />
          change password
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};
