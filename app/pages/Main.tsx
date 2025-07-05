import React from "react";
import styles from "../styles/main.module.css";

const Main = () => {
  return (
    <div className={styles.main}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src="/logo.png" alt="logo" />
        </div>
        <div className={styles.github}>
          <a href="">Give a star on Github</a>
        </div>
      </header>

      <div className={styles.mainContainer}>
        <div className={styles.formContainer}></div>
        <div className={styles.responseContainer}>
          See your request results here
        </div>
      </div>

      <footer className={styles.footer}>
        {" "}
        <p>
          <a
            href="https://www.linkedin.com/in/christian-mfuke-41b4b436a/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Made by Christian Mfuke
          </a>{" "}
        </p>
      </footer>
    </div>
  );
};

export default Main;
