import React, { Fragment } from "react";
import classNames from "classnames";

import "./Message.sass";

const Message = (props) => {
  const { isGameFinished, winner } = props;

  const styles = {
    Message: true,
    messageVisible: winner !== null && winner !== "",
  };

  return (
    <div className={classNames(styles)}>
      {isGameFinished && (
        <Fragment>
          WON: <span>{winner}</span>
        </Fragment>
      )}
    </div>
  );
};

export default Message;
