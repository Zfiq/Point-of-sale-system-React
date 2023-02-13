import React from "react";
import { Link } from "react-router-dom";
import FirbaseDB from "../Firebase/FirebaseDB";

const EditButtons = () => {
  return (
    <div>
      <div style={{ display: "inline-flex" }}>
        {" "}
        <Link to="/" style={{ textDecoration: "none" }}>
          {" "}
          <button className="back-top-left">Back</button>
        </Link>{" "}
        <span style={{ marginTop: "3px", color: "white" }}>Create Items</span>
      </div>
      <p></p>
      {/* Display CARDS Component */}
      <div className="grid-container">
        <FirbaseDB />

        {/* DISPLAY INFO ON CLICK */}
      </div>
      {/* END of SECTION */}
    </div>
  );
};

export default EditButtons;
