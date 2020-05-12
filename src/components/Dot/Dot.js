import React from "react";
import classNames from "classnames";

import "./Dot.sass";

const Dot = (props) => {
  const { onClick, status, field } = props;

  const dotSize = {
    small: field === 15,
    middle: field === 10,
    big: field === 5,
  };

  return (
    <li className={classNames("Dot", status, dotSize)} onClick={onClick} />
  );
};

export default Dot;
