import React from "react";
import { toggleCartHidden } from "../../redux/cart/cart.actions";

import "./custom-button.styles.scss";

const CustomButton = ({
  children,
  isGoogleSignIn,
  inverted,
  ...otherProps
}) => (
  <button
    className={`${inverted ? "inverted" : ""} ${
      isGoogleSignIn ? "google-sign-in" : ""
    } custom-button`}
    {...otherProps}
    onClick={toggleCartHidden}
  >
    {children}
  </button>
);

export default CustomButton;
