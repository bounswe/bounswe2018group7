import React, { Component } from "react";
import { Switch, Route } from "react-router";

import MainPage from "views/Components/Components";
import CreatePost from "screens/Home/CreatePost";
import An from "./An/index";

class Home extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/home" component={MainPage} />} />
          <Route path="/home/createpost" component={CreatePost} />
          <Route path="/home/an" component={An} />
        </Switch>
      </div>
    );
  }
}
export default Home;
