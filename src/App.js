import React, { Component } from "react";
import Loader from "react-loader-spinner";

import "./App.sass";
import { Game, Board } from "./components/index";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      winnersList: {},
    };
  }

  getWinnersList = (winnersList) => {
    this.setState({
      winnersList,
    });
  };

  render() {
    const { winnersList, loader } = this.state;
    console.log("loader", loader);

    if (loader) {
      return (
        <div className="loaderWrap">
          <Loader type="Circles" color="#00BFFF" height={100} width={100} />
        </div>
      );
    }

    return (
      <div className="App">
        <Game getWinnersList={this.getWinnersList} />
        <Board winnersList={winnersList} />
      </div>
    );
  }
}
