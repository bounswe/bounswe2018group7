// import React from "react";
// import ReactDOM from "react-dom";
// import { createBrowserHistory } from "history";
// import { Router, Route, Switch } from "react-router-dom";

// import indexRoutes from "routes/index.jsx";

// import "assets/scss/material-kit-react.css?v=1.3.0";

// var hist = createBrowserHistory();

// ReactDOM.render(
//   <Router history={hist}>
//     <Switch>
//       {indexRoutes.map((prop, key) => {
//         return <Route path={prop.path} key={key} component={prop.component} />;
//       })}
//     </Switch>
//   </Router>,
//   document.getElementById("root")
// );

import { SnackbarProvider } from "notistack";

import React from "react";
import ReactDOM from "react-dom";
// import "./index.css";
// import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import { store, history } from "redux/configureStore.js";

import { Switch, Route, Redirect } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";
// import Home from "./screens/Home";
import Auth from "./screens/FullScreen/Auth";
import Home from "./screens/Home";
// import NotFound from "./components/NotFound/index";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'

class App extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" render={() => <Redirect to={"/home"} />} />

        <Route path="/home" component={Home} />
        <Route path="/auth" component={Auth} />
        {/* <Route path="*" component={NotFound} /> */}
      </Switch>
    );
  }
}

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <SnackbarProvider maxSnack={3}>
        <App />
      </SnackbarProvider>
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();
