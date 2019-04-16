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
import Navigation from "./components/navigation.jsx";

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        <Router>
          <Navigation />
          <div className="inner-container">
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
              <Route
                path="/search/:cityName"
                exact
                render={({ match }) => (
                  <DetailsPage
                    cityName={match.params.cityName}
                    baseAPIUrl={this.props.baseAPIUrl}
                  />
                )}
              />
              <Route render={() => <Redirect to="/" />} />
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
