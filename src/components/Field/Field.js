import React, { Component } from "react";
import classNames from "classnames";

import "./Field.sass";
import { Dot } from "../index";

export default class Field extends Component {
  render() {
    const { field, fieldDots } = this.props;

    return (
      <div className="Field">
        {field && (
          <ul className="grid">
            {fieldDots.map((dot) => (
              <Dot
                key={dot.id}
                onClick={() => this.props.onClickDot(dot.id)}
                {...dot}
                field={field}
              />
            ))}
          </ul>
        )}
      </div>
    );
  }
}
