import React from "react";
import "./style.scss";

export default class Weather extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { image, location, temprature, max, min } = this.props;

    return (
      <div className="weather">
        <div className="inner-container">
          <div className="image">
            <img src={image} />
          </div>
          <div className="location">{location}</div>
          <div className="temprature">{parseInt(temprature)}</div>
          <div className="temp">
            <div className="min">{parseInt(min)}</div>
            <div>-</div>
            <div className="max">{parseInt(max)}</div>
          </div>
        </div>
      </div>
    );
  }
}
