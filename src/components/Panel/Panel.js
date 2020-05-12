import React, { Component } from "react";

import "./Panel.sass";

export default class Panel extends Component {
  render() {
    const {
      gameMode,
      gameSettings,
      isGameStarted,
      isGameFinished,
      user,
      loading,
    } = this.props;

    const disablePlayButton =
      gameMode === "DEFAULT" || user === "" || isGameStarted;

    return (
      <div className="Panel">
        <div className="gameMode">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <select value={gameMode} onChange={this.props.onChangeGameMode}>
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
            onChange={this.props.onChangeName}
            type="text"
            placeholder="Enter your user"
          />
        </div>
        <button
          className="playButton"
          onClick={this.props.onClickPlay}
          disabled={disablePlayButton}
        >
          {isGameFinished ? `PLAY AGAIN` : `PLAY`}
        </button>
      </div>
    );
  }
}
