import React, { Component, Fragment } from "react";

import "./Message.sass";

export default class Message extends Component {
  render() {
    const {
      componentProps: { isGameFinished, winner },
    } = this.props;

    return (
      <div className="Message">
        {isGameFinished && (
          <Fragment>
            WON: <span>{winner}</span>
          </Fragment>
        )}
      </div>
    );
  }
}
