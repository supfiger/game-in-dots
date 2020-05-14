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
      isGameFinished: false,
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
      await publishWinner(data);
    } catch (error) {
      console.error(error);
    }
  };

  onPublishWinner = async (data, isGameFinished) => {
    await this.setPublishWinner(data);
    this.fetchWinners();
    this.setState({
      isGameFinished,
    });
  };

  render() {
    const {
      winnersList,
      gameSettings,
      loadingSettings,
      loadingWinners,
      isGameFinished,
    } = this.state;

    return (
      <div className="App">
        <Game
          loadingSettings={loadingSettings}
          gameSettings={gameSettings}
          onPublishWinner={this.onPublishWinner}
        />
        <Board
          loadingWinners={loadingWinners}
          winnersList={winnersList}
          isGameFinished={isGameFinished}
        />
      </div>
    );
  }
}
