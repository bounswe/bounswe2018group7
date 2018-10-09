import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router";

import Login from "./Login";
import SignUp from "./SignUp";

class Auth extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/auth" render={() => <Redirect to={"/auth/login"} />} />
          <Route path="/auth/login" component={Login} />
          <Route path="/auth/signup" component={SignUp} />
        </Switch>
      </div>
    );
  }
}
export default Auth;
