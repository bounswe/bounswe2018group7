import React, { Component } from "react";

import Post from "../Post/index";
import postListData from "../../assets/dummy.json";
import { clSuccess } from "../../utils/consolelog";
class RecentPost extends Component {
  render() {
    return (
      <div>
        {postListData.map((post, index) => {
          return <Post data={post} />;
        })}
      </div>
    );
  }
}

export default RecentPost;
