import React, { Component } from "react";
import classNames from "classnames";

import "./Field.sass";
import { Dot } from "../index";

export default class Field extends Component {
  render() {
    const {
      componentProps: { field, fieldDots },
    } = this.props;

    return (
      <div className="Field">
        <ul
          className={classNames({
            grid: true,
            easy: field === 5,
            normal: field === 10,
            hard: field === 15,
          })}
        >
          {fieldDots.map((dot) => (
            <Dot
              key={dot.id}
              onClick={() => this.props.onClickDot(dot.id)}
              {...dot}
            />
          ))}
        </ul>
      </div>
    );
  }
}
