import React, { Component } from "react";

import "./App.sass";
import { Game, Board } from "./components/index";
import { gameSettings, winnersGet, publishWinner } from "./api.js";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      winnersList: {},
      gameSettings: {},
      loadingWinners: false,
      loadingSettings: false,
    };
  }

  componentDidMount() {
    this.fetchGameSettings();
    this.fetchWinners();
  }

  fetchWinners = async () => {
    this.setState({ loadingWinners: true });
    try {
      const result = await winnersGet();
      this.setState({
        winnersList: result.reverse(),
      });
    } catch (error) {
      console.error(error);
    } finally {
      this.setState({ loadingWinners: false });
    }
  };

  fetchGameSettings = async () => {
    this.setState({ loadingSettings: true });
    try {
      const result = await gameSettings();
      this.setState({
        gameSettings: result,
      });
    } catch (error) {
      console.error(error);
    } finally {
      this.setState({ loadingSettings: false });
    }
  };

  setPublishWinner = async (data) => {
    try {
      const result = await publishWinner(data);
    } catch (error) {
      console.error(error);
    }
  };

  onPublishWinner = async (data) => {
    await this.setPublishWinner(data);
    this.fetchWinners();
  };

  render() {
    const {
      winnersList,
      gameSettings,
      loadingSettings,
      loadingWinners,
    } = this.state;

    return (
      <div className="App">
        <Game
          loadingSettings={loadingSettings}
          gameSettings={gameSettings}
          onPublishWinner={this.onPublishWinner}
        />
        <Board loadingWinners={loadingWinners} winnersList={winnersList} />
      </div>
    );
  }
}
