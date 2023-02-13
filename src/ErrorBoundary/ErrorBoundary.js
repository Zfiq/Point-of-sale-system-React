import React, { Component } from "react";
import { Link } from "react-router-dom";
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
    };
  }
  componentDidCatch(error, errorInfo) {
    console.log("Logging ", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        //  Display Message after error
        <h1 style={{ color: "black", marginLeft: "10%" }}>
          No data available in selected date period
          {/* Link to go back to home after error else continue without chart */}
          <Link style={{ textDecoration: "none" }} to="/">
            {" "}
            <button>
              <i className="material-icons">home</i>
            </button>{" "}
          </Link>
        </h1>
      );
    }
    return this.props.children;
  }
}
