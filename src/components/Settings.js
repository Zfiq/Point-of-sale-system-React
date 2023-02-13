import React from "react";
import { Link } from "react-router-dom";
import {
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";

import db from "../Firebase/Firebase";
import Update from "./Update";
import { useState } from "react";

const Settings = () => {
  // Current Date and time
  const today = new Date();
  const date = today.getFullYear();
  const [show, setShow] = useState(false);

  const auth = getAuth(db);

  const verifyEmail = () => {
    if (
      window.confirm(
        "An email will be sent to you for verification\nWould you like to proceed ? "
      )
    ) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          sendEmailVerification(auth.currentUser).then(() => {
            alert("Email verification sent to your email");
          });
        }
      });
    }
  };

  const logOut = () => {
    if (window.confirm("Are you sure you want to sign out ? ")) {
      signOut(auth)
        .then(() => {
          // Sign-out successful Clear input fields and login status to false.
          localStorage.removeItem("userEmail");
          localStorage.removeItem("BusinessNameDB");
        })
        .catch((error) => {
          // An error happened.
          alert("An error happened.");
        });
    }
  };

  const resetPassword = () => {
    if (
      window.confirm(
        "An email will be sent to you with the reset link\nWould you like to proceed ? "
      )
    ) {
      sendPasswordResetEmail(auth, localStorage.getItem("userEmail"))
        .then(() => {
          // Password reset email sent!
          alert("To change password please check your email");
        })
        .catch((error) => {
          const errorCode = error.code;
          //   const errorMessage = error.message;
          alert(errorCode);
        });
    }
  };
  const deleteAccount = () => {
    if (
      window.confirm(
        " PLEASE NOTE\n" +
          "This operation cannot be undone and all your saved data will be deleted\n" +
          "Would you like to proceed ?"
      )
    ) {
      const user = auth.currentUser;

      user

        .delete()
        .then(() => {
          // User deleted.
          alert("Your account is deleted");
        })
        .catch((error) => {
          // An error ocurred
          alert(error);
        });
      // Also delete all data from database.
      // remove(ref(db, 'Buutons/'));
    }
  };

  return (
    <div>
      <h2 style={{ color: "white" }}>Settings</h2>
      <Link style={{ textDecoration: "none", color: "green" }} to="/">
        <button className="back-top-left">Back</button>
      </Link>

      <div className="navbar2">
        <footer>
          Copyright &copy;<span>{date} </span>
          <span>
            <br></br>
            All rights reserved | Powered by
            <a href="http://www.dressupsalon.com/iztech.php">
              <br></br>I-Z Tech
            </a>
          </span>
        </footer>
      </div>

      <div className="main">
        <div className="btnGroup">
          <div className="btn" onClick={() => setShow(!show)}>
            {show ? "hide" : "Edit Items"} &nbsp;{" "}
            <i className="material-icons">edit</i>
          </div>
          <div className="btn" onClick={verifyEmail}>
            Verify email &nbsp; <i className="material-icons">mail</i>
          </div>
          <div className="btn" onClick={resetPassword}>
            Change password &nbsp; <i className="material-icons">update</i>
          </div>
          <div className="btn" onClick={deleteAccount}>
            Remove account <i className="material-icons">delete_forever</i>
          </div>
          &nbsp;{" "}
          <div className="btn" onClick={logOut}>
            Sign Out &nbsp; <i className="material-icons">logout</i>
          </div>
        </div>

        {show && (
          <div className="updateComponent">
            <button
              className="update-close-btn"
              style={{ height: "30px", width: "60px" }}
              onClick={() => setShow(!show)}
            >
              {show ? "Close" : ""}
            </button>
            <p></p>

            <Update />
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
