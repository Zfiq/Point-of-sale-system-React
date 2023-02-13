import React from "react";

export default function Footer() {
  // Current Date and time
  const today = new Date();
  const date = today.getFullYear();
  return (
    <div className="footer">
      Copyright &copy;<span>{date} </span>
      <span>
        All rights reserved | Powered by{" "}
        <a href="http://www.dressupsalon.com/iztech.php">I-Z Tech</a>
      </span>
    </div>
  );
}
