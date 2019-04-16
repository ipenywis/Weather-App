import React from "react";
import Weather from "../weather";
import { HashLoader } from "react-spinners";
import axios from "axios";

export default class DetailsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todaysWeather: {},
      upcomingDaysWeather: [],
      location: null,
      timezone: null,
      isLoading: false
    };
    //Days of the week
    this.weekDays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ];
  }

  /**
   * Load a specific weather image for abbreviation
   * @param {String} abbr
   */
  getWeatherImage(abbr) {
    //const imgRes = await axios.get(`${baseAPIUrl}/static/img/weather/png/64/${abbr}.png`).catch((err) => console.error("Cannot load Weather Image"));
    return `https://www.metaweather.com/static/img/weather/png/64/${abbr}.png`;
  }

  loadWeatherImageForLocations(locations) {
    let data = [];
    for (const location of locations) {
      data.push({
        ...location,
        image: this.getWeatherImage(location.weather_state_abbr)
      });
    }
    return data.length > 0 ? data : locations;
  }

  startLoading() {
    this.setState({ isLoading: true });
  }

  stopLoading() {
    this.setState({ isLoading: false });
  }

  async componentDidMount() {
    const { baseAPIUrl, woeid } = this.props;
    //Start Loading
    this.startLoading();
    //load Weather Data from API (through weather.php) for current woeid
    const url = `${baseAPIUrl}/?command=location&woeid=${woeid}`;
    const locationWeather = await axios.get(url).catch(err => {
      console.error("Error Loading details for woeid: ", woeid);
    });
    if (!locationWeather) return;
    //Upcoming weather data for the next 6 days with their corresponding images
    const upcomingDaysWeather = this.loadWeatherImageForLocations(
      locationWeather.data.consolidated_weather.slice(1)
    );
    //Current weather
    let todaysWeather = locationWeather.data.consolidated_weather[0];
    //Load today's weather image
    todaysWeather = {
      ...todaysWeather,
      image: this.getWeatherImage(todaysWeather.weather_state_abbr)
    };
    //Location and Timezone
    const location = locationWeather.data.title;
    const timezone = locationWeather.data.timezone;
    //Set state
    this.setState({ upcomingDaysWeather, todaysWeather, location, timezone });
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
    const {
      upcomingDaysWeather,
      todaysWeather,
      location,
      timezone,
      isLoading
    } = this.state;
    return (
      <div className="details-container">
        <div className="details-inner-container">
          <div className="page-header" style={{ fontSize: "32px" }}>
            {location}
          </div>
          <div className="page-header" style={{ fontSize: "22px" }}>
            {timezone}
          </div>
          {this.renderLoading()}
          {!isLoading && (
            <div className="todays-weather">
              <Weather
                image={todaysWeather.image}
                location={location}
                temprature={todaysWeather.the_temp}
                min={todaysWeather.min_temp}
                max={todaysWeather.max_temp}
                style={{ marginRight: 0 }}
              />
            </div>
          )}
          {!isLoading && (
            <div className="upcoming-days">
              {upcomingDaysWeather.map((data, idx) => {
                const dayIdx = new Date(data.applicable_date).getDay() - 1;
                const currentDay = this.weekDays[dayIdx >= 0 ? dayIdx : 6];
                return (
                  <Weather
                    key={idx}
                    image={data.image}
                    location={currentDay}
                    temprature={data.the_temp}
                    min={data.min_temp}
                    max={data.max_temp}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }
}
