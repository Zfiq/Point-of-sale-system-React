import React from "react";
import { Link } from "react-router-dom";
import Chart from "./Chart";
const AllCharts = () => {
  return (
    <div style={{ backgroundColor: "white" }}>
      <Link
        to="/orderrecord"
        style={{
          textDecoration: "none",
          color: "green",
          fontSize: "1em",
        }}
      >
        <button className="back-top-left">Back</button>{" "}
        <h1 style={{ color: "black", marginTop: "0%" }}>Sales Report</h1>{" "}
      </Link>{" "}
      <Chart />
    </div>
  );
};

export default AllCharts;
