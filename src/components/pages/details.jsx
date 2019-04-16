import React from "react";
import Weather from "../weather";
import { HashLoader } from "react-spinners";
import axios from "axios";
import SearchBar from "../search";

export default class DetailsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todaysWeather: {},
      upcomingDaysWeather: [],
      location: null,
      timezone: null,
      isLoading: false,
      isError: false,
      errors: []
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

  setError(error, clearTimeout = true) {
    this.setState({
      isError: true,
      errors: [error]
    });
    //Clear Errors after some time
    if (clearTimeout)
      setTimeout(() => {
        this.clearAllErrors();
      }, 5000);
  }

  clearAllErrors() {
    this.setState({ isError: false, errors: [] });
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

  async getLocationWeather() {
    const { baseAPIUrl, woeid, cityName } = this.props;
    let url;
    if (woeid) url = `${baseAPIUrl}/?command=location&woeid=${woeid}`;
    else if (cityName) {
      //Find using location name
      const tempUrl = `${baseAPIUrl}/?command=search&keyword=${cityName}`;
      const locationRes = await axios.get(tempUrl);
      //Check if no location with keyword is found
      if (!locationRes.data || locationRes.data.length === 0) {
        this.setError(
          "No results were found. Try changing the keyword!",
          false
        );
        //Stop loading
        return this.stopLoading();
      }
      url = `${baseAPIUrl}/?command=location&woeid=${
        locationRes.data[0].woeid
      }`;
    }
    const locationWeather = await axios.get(url).catch(err => {
      this.stopLoading();
    });
    return locationWeather.data;
  }

  async prepareLocationWeather() {
    //Start Loading
    this.startLoading();
    //load Weather Data from API (through weather.php) for current woeid
    const locationWeather = await this.getLocationWeather();
    if (!locationWeather || locationWeather.length === 0) {
      return this.stopLoading();
    }
    //Upcoming weather data for the next 6 days with their corresponding images
    const upcomingDaysWeather = this.loadWeatherImageForLocations(
      locationWeather.consolidated_weather.slice(1)
    );
    //Current weather
    let todaysWeather = locationWeather.consolidated_weather[0];
    //Load today's weather image
    todaysWeather = {
      ...todaysWeather,
      image: this.getWeatherImage(todaysWeather.weather_state_abbr)
    };
    //Location and Timezone
    const location = locationWeather.title;
    const timezone = locationWeather.timezone;
    //Set state
    this.setState({ upcomingDaysWeather, todaysWeather, location, timezone });
    //Stop Loading
    this.stopLoading();
  }

  componentDidMount() {
    this.prepareLocationWeather();
  }

  componentWillReceiveProps() {
    this.prepareLocationWeather();
    window.location.reload();
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
      isLoading,
      isError,
      errors
    } = this.state;
    return (
      <div className="details-container">
        {isError && (
          <div className="errors-container">
            {errors.map((err, idx) => {
              return (
                <div className="error" key={idx}>
                  {err}
                </div>
              );
            })}
          </div>
        )}
        <SearchBar baseAPIUrl={this.props.baseAPIUrl} />
        <hr />
        <div className="details-inner-container">
          <div className="page-header" style={{ fontSize: "32px" }}>
            {location}
          </div>
          <div className="page-header" style={{ fontSize: "22px" }}>
            {timezone}
          </div>
          {this.renderLoading()}
          {!isLoading && !isError && (
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
          {!isLoading && !isError && (
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
