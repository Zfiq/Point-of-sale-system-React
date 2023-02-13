import React from "react";
import { Link } from "react-router-dom";

// import {useState} from 'react'
// import TakeOrder from './TakeOrder'

import "./styles.css";

const GridOptions = () => {
  return (
    <div>
      <div className="cards">
        <div className="card2">
          <Link style={{ textDecoration: "none" }} to="takeorder">
            {" "}
            <button className="main-btn1">
              Take order &nbsp; &nbsp; &nbsp; &nbsp;{" "}
              <i className="material-icons">dvr</i>
            </button>{" "}
          </Link>
        </div>

        <div className="card2">
          <Link
            style={{ textDecoration: "none", marginTop: "-50%" }}
            to="editbuttons"
          >
            {" "}
            <button className="main-btn1">
              Create Items &nbsp; &nbsp; &nbsp; &nbsp;{" "}
              <i className="material-icons">edit</i>
            </button>{" "}
          </Link>
        </div>
        <div className="card2">
          <Link style={{ textDecoration: "none" }} to="orderrecord">
            {" "}
            <button className="main-btn1">
              Order History &nbsp; &nbsp; &nbsp; &nbsp;{" "}
              <i className="material-icons">history</i>
            </button>{" "}
          </Link>
        </div>

        <div className="card2">
          <Link style={{ textDecoration: "none" }} to="settings">
            {" "}
            <button className="main-btn1">
              settings&nbsp; &nbsp; &nbsp; &nbsp;{" "}
              <i className="material-icons">settings</i>
            </button>{" "}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GridOptions;
