import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { fetchPost, fetchPostReset } from "redux/post/Actions.js";

import Post from "components/Post/index";
import postListData from "assets/dum.json";
class RecentPost extends PureComponent {
  componentDidMount() {
    this.props.fetchPost();
  }

  render() {
    const { postList } = this.props.post;
    if (!postList.results) return null; // todo: render loading spinner
    return (
      <div>
        {postList.results.map(post => (
          <Post key={post.id} data={post} />
        ))}
      </div>
    );
  }
}
const mapDispatchToProps = {
  fetchPost,
  fetchPostReset
};

const mapStateToProps = state => ({
  post: state.post
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecentPost);
