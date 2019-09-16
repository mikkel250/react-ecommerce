import React from "react";
import { CustomButtonContainer } from "./custom-button.styles";

//an example of styled components instead of using CSS
const CustomButton = ({ children, ...props }) => (
  <CustomButtonContainer {...props}>{children}</CustomButtonContainer>
);

export default CustomButton;
