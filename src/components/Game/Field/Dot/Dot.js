import React from "react";
import classNames from "classnames";

import "./Dot.sass";

const Dot = (props) => {
  const { onClick, status, field } = props;
  const dotSize = {
    big: field == 5,
    normal: field == 10,
    small: field == 15,
  };

  return (
    <li className={classNames("Dot", status, dotSize)} onClick={onClick} />
  );
};

export default Dot;
