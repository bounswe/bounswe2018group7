import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router";

import Login from "./Login";

class Auth extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/auth" render={() => <Redirect to={"/auth/login"} />} />
          <Route path="/auth/login" component={Login} />
        </Switch>
      </div>
    );
  }
}
export default Auth;
