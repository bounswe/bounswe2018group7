import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router";

import Login from "./Login";
import SignUp from "./SignUp";
import Email from "./Email";

class Auth extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/auth" render={() => <Redirect to={"/auth/signin"} />} />
          <Route path="/auth/signin" component={Login} />
          <Route path="/auth/signup" component={SignUp} />
          <Route path="/auth/email" component={Email} />
        </Switch>
      </div>
    );
  }
}
export default Auth;
