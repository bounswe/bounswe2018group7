import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import { store, history } from "redux/configureStore.js";

import { Switch, Route, Redirect } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";
import Home from "./screens/Home";
import Auth from "./screens/FullScreen/Auth";
import NotFound from "./components/NotFound/index";

class App extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" render={() => <Redirect to={"/home"} />} />

        <Route path="/home" component={Home} />
        <Route path="/auth" component={Auth} />
        <Route path="/app" component={Home} />
        <Route path="*" component={NotFound} />
      </Switch>
    );
  }
}

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
