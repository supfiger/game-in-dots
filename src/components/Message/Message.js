import React, { Fragment } from "react";
import classNames from "classnames";

import "./Message.sass";

const Message = (props) => {
  const { isGameStarted, isGameFinished, winner, points } = props;
  const isCounterVisible = points && isGameStarted && !isGameFinished;
  const winnerCount = winner !== null && points[winner].length;
  console.log("winnerCount", winnerCount);

  const messageStyles = {
    Message: true,
    messageVisible: isCounterVisible || (winner !== null && winner !== ""),
  };

  return (
    <div className={classNames(messageStyles)}>
      {isCounterVisible && (
        <div className="pointsCounterWrap">
          <span>{`user: ${points.user.length}`}</span>
          <span>{`computer: ${points.computer.length}`}</span>
        </div>
      )}
      {isGameFinished && (
        <Fragment>
          <span>{winner}</span> won <span>({winnerCount} dots)</span>
        </Fragment>
      )}
    </div>
  );
};

export default Message;
