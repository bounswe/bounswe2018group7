import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router";

import MainPage from "views/Components/Components";
import CreatePost from "screens/Home/CreatePost";

class Home extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/home" component={MainPage} />} />
          <Route path="/home/createpost" component={CreatePost} />
        </Switch>
      </div>
    );
  }
}
export default Home;
