import React, { Fragment } from "react";

import "./Message.sass";

const Message = (props) => {
  const { isGameFinished, winner } = props;

  return (
    <div className="Message">
      {isGameFinished && (
        <Fragment>
          WON: <span>{winner}</span>
        </Fragment>
      )}
    </div>
  );
};

export default Message;
