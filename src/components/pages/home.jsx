import React from "react";
import "./style.scss";
import Weather from "../weather";
import { Link } from "react-router-dom";
import axios from "axios";
import { HashLoader } from "react-spinners";
import SearchBar from "../search";

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: [
        "Istanbul",
        "Berlin",
        "london",
        "Helsinki",
        "Dublin",
        "Vancouver"
      ],
      weatherData: [], ///< All locations weather objects data are stored here
      isLoading: false
    };
  }

  /**
   * Load a specific weather image for abbreviation
   * @param {String} abbr
   */
  getWeatherImage(abbr) {
    //const imgRes = await axios.get(`${baseAPIUrl}/static/img/weather/png/64/${abbr}.png`).catch((err) => console.error("Cannot load Weather Image"));
    return `https://www.metaweather.com/static/img/weather/png/64/${abbr}.png`;
  }

  startLoading() {
    this.setState({ isLoading: true });
  }

  stopLoading() {
    this.setState({ isLoading: false });
  }

  async componentDidMount() {
    const { baseAPIUrl } = this.props;
    const { locations } = this.state;
    //Start Loading
    this.startLoading();
    //load Weather Data from API (through weather.php) for all locations
    for (const location of locations) {
      const searchUrl = `${baseAPIUrl}/?command=search&keyword=${location}`;
      //Search for location by keyword(name)
      const locationRes = await axios.get(searchUrl);
      const fetchUrl = `${baseAPIUrl}/?command=location&woeid=${
        locationRes.data[0].woeid
      }`;
      //Get location weather data
      const locationWeather = await axios.get(fetchUrl);
      //Get today's weather
      const todaysWeather = locationWeather.data.consolidated_weather[0];
      //Get tadays weather image
      const weatherImage = this.getWeatherImage(
        todaysWeather.weather_state_abbr
      );
      //Save weather data on state
      this.setState(prevState => ({
        weatherData: [
          ...prevState.weatherData,
          {
            ...todaysWeather,
            title: locationRes.data[0].title,
            image: weatherImage,
            woeid: locationRes.data[0].woeid
          }
        ]
      }));
    }
    //Stop Loading
    this.stopLoading();
  }

  renderLoading() {
    return (
      <HashLoader
        loading={this.state.isLoading}
        size={80}
        sizeUnit={"px"}
        color="#3498db"
      />
    );
  }

  render() {
    const { weatherData, isLoading } = this.state;
    const progress = weatherData.length * 16.7; ///< for calculating progress percentage
    return (
      <div className="home-container">
        <SearchBar baseAPIUrl={this.props.baseAPIUrl} />
        <div className="home-inner-container">
          <div className="page-header">Today's Weather</div>
          <div className="weathers-container">
            {this.renderLoading()}
            {!isLoading &&
              weatherData.map((data, idx) => {
                return (
                  <Link to={`/weather/${data.woeid}`}>
                    <Weather
                      image={data.image}
                      location={data.title}
                      temprature={data.the_temp}
                      min={data.min_temp}
                      max={data.max_temp}
                    />
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    );
  }
}
