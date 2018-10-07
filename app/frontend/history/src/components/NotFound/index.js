import React from "react";
import { Link } from "react-router-dom";
import PageNotFound from "assets/img/PageNotFound.jpg";
const NotFound = () => (
  <div>
    <img
      src={PageNotFound}
      style={{ width: 345, height: 743, display: "block", margin: "auto", position: "relative" }}
      alt={"page not found"}
    />
    <center>
      <Link to="/">Return to Home Page</Link>
    </center>
  </div>
);
export default NotFound;
