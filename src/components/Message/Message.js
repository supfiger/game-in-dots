import React, { Fragment } from "react";
import classNames from "classnames";

import "./Message.sass";

const Message = (props) => {
  const { isGameStarted, isGameFinished, winner } = props;

  const styles = {
    Message: true,
    messageVisible: isGameStarted || (winner !== null && winner !== ""),
  };

  console.log("Message isGameFinished", isGameFinished);

  return (
    <div className={classNames(styles)}>
      {isGameFinished && (
        <Fragment>
          WON: <span>{winner}</span>
        </Fragment>
      )}
      {isGameStarted && <span>Game is started!</span>}
    </div>
  );
};

export default Message;
