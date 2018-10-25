import React, { Component } from "react";
import PVideo from "../PVideo";
import PImg from "../PImg/index";
import PSound from "../PSound/index";

class RecentPost extends Component {
  render() {
    return (
      <div>
        <PImg />
        <PVideo />

        <PSound />
      </div>
    );
  }
}

export default RecentPost;
