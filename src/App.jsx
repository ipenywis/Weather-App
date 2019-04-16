import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
//Pages
import HomePage from "./components/pages/home.jsx";

import "./App.scss";

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        <div className="inner-container">
          <Router>
            <Switch>
              <Route
                path="/"
                render={() => <HomePage baseAPIUrl={this.props.baseAPIUrl} />}
              />
              <Route render={() => <Redirect to="/" />} />
            </Switch>
          </Router>
        </div>
      </div>
    );
  }
}

export default App;
