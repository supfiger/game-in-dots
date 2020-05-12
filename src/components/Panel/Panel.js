import React, { Component } from "react";

import "./Panel.sass";

export default class Panel extends Component {
  render() {
    const {
      componentProps: {
        field,
        gameMode,
        gameSettings,
        user,
        winner,
        isGameStarted,
        isGameFinished,
        loading,
      },
    } = this.props;

    const disablePlayButton =
      gameMode === "DEFAULT" || user === "" || isGameStarted;

    return (
      <div className="Panel">
        <div className="gameMode">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <select value={gameMode} onChange={this.onChangeGameMode}>
              <option value="DEFAULT" disabled>
                Pick game mode...
              </option>
              {Object.keys(gameSettings).map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="inputName">
          <input
            className="enterName"
            value={user}
            onChange={this.onChangeName}
            type="text"
            placeholder="Enter your user"
          />
        </div>
        <button
          className="playButton"
          onClick={this.onClickPlay}
          disabled={disablePlayButton}
        >
          {isGameFinished ? `PLAY AGAIN` : `PLAY`}
        </button>
      </div>
    );
  }
}
