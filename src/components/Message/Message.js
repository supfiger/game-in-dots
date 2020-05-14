import React, { Fragment } from "react";
import classNames from "classnames";

import "./Message.sass";

const Message = (props) => {
  const { isGameStarted, isGameFinished, winner } = props;

  const messageStyles = {
    Message: true,
    messageVisible: isGameStarted || (winner !== null && winner !== ""),
  };

  return (
    <div className={classNames(messageStyles)}>
      {isGameStarted && !isGameFinished && <span>Game is started!</span>}
      {isGameFinished && (
        <Fragment>
          <span>{winner}</span> won
        </Fragment>
      )}
    </div>
  );
};

export default Message;
