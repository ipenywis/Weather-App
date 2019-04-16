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
import DetailsPage from "./components/pages/details.jsx";

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
                exact
                render={() => <HomePage baseAPIUrl={this.props.baseAPIUrl} />}
              />
              <Route
                path="/weather/:woeid"
                exact
                render={({ match }) => (
                  <DetailsPage
                    woeid={match.params.woeid}
                    baseAPIUrl={this.props.baseAPIUrl}
                  />
                )}
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
