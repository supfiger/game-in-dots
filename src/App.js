import React, { Component, Fragment } from "react";
import Loader from "react-loader-spinner";

import "./App.sass";
import { Game, Board } from "./components/index";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      winnersList: {},
      loader: true,
    };
  }

  getWinnersList = (winnersList) => {
    this.setState({
      winnersList,
    });
  };

  componentDidMount() {
    this.setState({
      loader: localStorage.getItem("loader"),
    });
  }

  render() {
    const { winnersList, loader } = this.state;
    console.log("loader", loader);

    return (
      <div className="App">
        {!loader ? (
          <div className="loaderWrap">
            <Loader type="Circles" color="#00BFFF" height={100} width={100} />
          </div>
        ) : (
          <Fragment>
            <Game getWinnersList={this.getWinnersList} />
            <Board winnersList={winnersList} />
          </Fragment>
        )}
      </div>
    );
  }
}
