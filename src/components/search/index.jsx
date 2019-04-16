import React from "react";
import "./style.scss";
import axios from "axios";
import { Redirect, withRouter } from "react-router-dom";

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isError: false,
      errors: [],
      searchInput: null
    };
  }

  setError(error) {
    this.setState(prevState => ({
      isError: true,
      errors: [...prevState.errors, error]
    }));
    //Clear Errors after some time
    setTimeout(() => {
      this.clearAllErrors();
    }, 5000);
  }

  clearAllErrors() {
    this.setState({ isError: false, errors: [] });
  }

  onInputChange(e) {
    this.setState({ searchInput: e.target.value });
  }

  clearSearchInput() {
    this.searchInput.value = "";
  }

  async onSubmit() {
    const { searchInput } = this.state;
    if (!searchInput || searchInput === "")
      return this.setError("Please Enter a search Keyword");
    const { baseAPIUrl, history } = this.props;
    //Resolve location by keyword
    const url = `${baseAPIUrl}/?command=search&keyword=${searchInput}`;
    const searchRes = await axios.get(url).catch(err => {
      console.error("Search Error", err);
    });
    if (!searchRes || !searchRes.data || searchRes.data.length === 0) {
      //Clear Input
      this.clearSearchInput();
      //Show Error
      return this.setError("No results were found. Try changing the keyword!");
    }
    //Redirect to location page
    history.push(`/search/${searchRes.data[0].title}`);
  }

  handleKeyPress(e) {
    if (e.key === "Enter") this.onSubmit();
  }

  render() {
    const { isError, errors } = this.state;
    return (
      <div className="search">
        <div className="search-container">
          <div className="title">Enter Location Name</div>

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

          <div className="search-bar">
            <input
              type="text"
              placeholder="Location, City"
              onChange={this.onInputChange.bind(this)}
              onKeyPress={this.handleKeyPress.bind(this)}
              ref={input => (this.searchInput = input)}
            />
          </div>
          <button className="search-btn" onClick={this.onSubmit.bind(this)}>
            Search
          </button>
        </div>
      </div>
    );
  }
}

export default withRouter(SearchBar);
