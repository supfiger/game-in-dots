import React, { Component } from "react";
import Loader from "react-loader-spinner";

import "./App.sass";
import { Game, Board } from "./components/index";
import { gameSettings, winnersGet } from "./api.js";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      winnersList: {},
      gameSettings: {},
      loader: false,
      error: null,
    };
  }

  fetchWinnersGet = async () => {
    this.setState({ loader: true });
    try {
      const result = await winnersGet();
      this.setState({
        winnersList: result.reverse(),
      });
    } catch (error) {
      this.setState({
        error: error,
      });
    } finally {
      this.setState({ loader: false });
    }
  };

  fetchGameSettings = async () => {
    this.setState({ loader: true });
    try {
      const result = await gameSettings();
      this.setState({
        gameSettings: result,
      });
    } catch (error) {
      this.setState({
        error: error,
      });
    } finally {
      this.setState({ loader: false });
    }
  };

  componentDidMount() {
    this.fetchGameSettings();
    this.fetchWinnersGet();
  }

  render() {
    const { winnersList, gameSettings, loader } = this.state;

    if (loader) {
      return (
        <div className="loaderWrap">
          <Loader type="ThreeDots" color="#00BFFF" height={100} width={100} />
        </div>
      );
    }

    return (
      <div className="App">
        <Game
          gameSettings={gameSettings}
          fetchWinnersGet={this.fetchWinnersGet}
        />
        <Board winnersList={winnersList} />
      </div>
    );
  }
}
