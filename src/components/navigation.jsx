import React from "react";
import { Link } from "react-router-dom";

export default class Navigation extends React.Component {
  render() {
    return (
      <div className="navigation-bar">
        <div className="nav-inner-container">
          <div className="brand">Weather App</div>
          <div className="nav">
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
