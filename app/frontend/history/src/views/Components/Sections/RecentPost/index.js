import React, { Component } from "react";

import Post from "components/Post/index";
import postListData from "assets/dummy.json";
class RecentPost extends Component {
  render() {
    return (
      <div>
        {postListData.map((post, index) => {
          return <Post key={index} data={post} />;
        })}
      </div>
    );
  }
}

export default RecentPost;
