import React, { Fragment } from "react";
import classNames from "classnames";

import "./Message.sass";

const Message = (props) => {
  const { isGameFinished, winner } = props;

  const messageStyles = {
    Message: true,
    messageVisible: winner !== null && winner !== "",
  };

  return (
    <div className={classNames(messageStyles)}>
      {isGameFinished && (
        <Fragment>
          <span>{winner}</span> won
        </Fragment>
      )}
    </div>
  );
};

export default Message;
