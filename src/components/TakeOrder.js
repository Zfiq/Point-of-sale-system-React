import React from "react";
import ClientTakeOrder from "../Firebase/ClientTakeOrder";
import { Link } from "react-router-dom";

const TakeOrder = () => {
  return (
    <div>
      <div>
        <nav>
          <div style={{ display: "inline-flex" }}>
            {" "}
            <Link
              to="/"
              style={{
                textDecoration: "none",
                color: "green",
                fontSize: "1em",
              }}
            >
              <button className="back-top-left">Back</button>
            </Link>{" "}
            <span style={{ marginTop: "3px", color: "white" }}>
              Take Orders
            </span>
          </div>
        </nav>
      </div>
      <br />
      {/* Backen file is ClientTakeOrder.js */}
      <ClientTakeOrder />
    </div>
  );
};

export default TakeOrder;
