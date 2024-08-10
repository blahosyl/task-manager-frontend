import React from 'react'

import styles from "../styles/Footer.module.css";

function Footer() {
  return (
    <footer className={`
        mt-auto py-3 dark-bg text-white
        ${styles.Footer}
    `}>
        <p className="m-0 text-center">&copy; Sylvia Blaho</p>
        <p className="m-0 text-center mt-2">
            <a className="text-reset" 
            href="https://github.com/blahosyl/" target="_blank"  rel="noreferrer" 
                aria-label="Visit my GitHub profile"><i
                    className="fa-brands fa-square-github fs-3 mx-1 footer-link"></i></a>
            <a className="text-reset" href="https://www.linkedin.com/in/blahosylvia/" target="_blank"  rel="noreferrer" 
                aria-label="Visit my LinkedIn profile"><i className="fa-brands fa-linkedin fs-3 mx-1 footer-link"></i></a>
        </p>
    </footer>
  )
}

export default Footer