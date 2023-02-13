import "./App.css";
import GridOtions from "./components/GridOptions";
import TakeOrder from "./components/TakeOrder";
import OrdersRecord from "./components/OrdersRecord";
import EditButtons from "./components/EditButtons";
import Settings from "./components/Settings";
import db from "./Firebase/Firebase";

import { mainDBName } from "./Firebase/BusinessNamedb";
import { checkUser } from "./Firebase/BusinessNamedb";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import AllCharts from "./Chart/AllCharts";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [form, setForm] = useState(true);
  const [showComponent, setShowComponent] = useState(false); // Show Routes after login
  const [restNameInput, setrestNameInput] = useState(""); // Business name input

  const [disable, setDisable] = useState(true); // Button Disable Enable
  const auth = getAuth(db);

  const signUp = () => {
    setrestNameInput(true);
  };

  const createAcc = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        setrestNameInput(false);
        setDisable(true);
        setrestNameInput(true);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("BusinessName", restNameInput); // Create business name for the user only during SignUp.
        mainDBName(); // Process the business name to generate business name.

        alert("Account successfully created");
      })
      .catch((error) => {
        const errorCode = error.code;
        // const errorMessage = error.message;
        alert(errorCode);
      });
  };

  const restaurantName = (e) => {
    setrestNameInput(e.target.value);

    if (e.target.value.length > 0) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  };

  const signIn = () => {
    setrestNameInput(false);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        // on Sign in get email
        localStorage.setItem("userEmail", email);
        checkUser();
      })
      .catch((error) => {
        const errorCode = error.code;
        // const errorMessage = error.message;
        alert(errorCode);
      });
  };

  const resetPassword = () => {
    if (
      window.confirm(
        "An email will be sent to you for verification\nWould you like to proceed ? "
      )
    ) {
      sendPasswordResetEmail(auth, email)
        .then(() => {
          // Password reset email sent!
          alert("Reset password sent to your email");
        })
        .catch((error) => {
          const errorCode = error.code;
          //   const errorMessage = error.message;
          alert(errorCode);
          // ..
        });
    }
  };

  // Run once and it will stay logged in unless sign out button is pressed.
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      // On Update hook state will change.
      if (user) {
        // const uid = user.uid;
        setForm(false);
        setShowComponent(true);
        checkUser();
        // Clear field on login
        setEmail("");
        setPassword("");
      } else {
        // User is signed out

        setForm(true);
        setShowComponent(false);
      }
    });
  }); // After signOut the useEffect hook will Unmount.

  // Recheck user and set Business name.
  useEffect(() => {
    checkUser();
  });

  const emailInput = () => {
    if (email === "") {
      alert("Please provide account email ");
    } else {
      // If valid email is provided.send email
      resetPassword();
    }
  };

  return (
    <div>
      {form && (
        <div
          className="login-form"
          style={{ backgroundImage: `url("./pos-background.jpeg")` }}
        >
          <h1 style={{ color: "white" }}>Login</h1>
          <div className="content">
            <div className="input-field">
              {restNameInput && (
                <input
                  type="text"
                  placeholder="Business Name"
                  onChange={restaurantName}
                />
              )}
              <br></br>
              <input
                type="email"
                placeholder="E-mail"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className="input-field">
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            {/* <a href="#" className="link"> */}
            <span style={{ color: "white" }} onClick={emailInput}>
              {" "}
              Forgot Your Password?{" "}
            </span>
            {/* </a> */}
          </div>
          <div className="action">
            <button onClick={signUp}>Sign Up</button>
            {restNameInput && (
              <button disabled={disable} onClick={createAcc}>
                Create
              </button>
            )}
            <button onClick={signIn}>Sign In </button>
          </div>
        </div>
      )}

      {showComponent && (
        <BrowserRouter>
          <div className="App">
            <Routes>
              <Route path="/" exact element={<GridOtions />} />
              <Route path="/takeorder" element={<TakeOrder />} />
              <Route path="/allcharts" element={<AllCharts />} />
              <Route path="/orderrecord" element={<OrdersRecord />} />
              <Route path="/editbuttons" element={<EditButtons />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </BrowserRouter>
      )}
    </div>
  );
}
export default App;
