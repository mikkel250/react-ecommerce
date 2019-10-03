import React from "react";
import {
  ErrorImageOverlay,
  ErrorImageContainer,
  ErrorImageText
} from "./error-boundary.styles";

class ErrorBoundary extends React.Component {
  constructor() {
    super();

    this.state = {
      hasErrored: false
    };
  }
  static getDerivedStateFromError(error) {
    // process the error
    return { hasErrored: true };
  }

  componentDidCatch(error, info) {
    console.log(error);
  }

  render() {
    // if an error has occurred, render some UI that informs user
    if (this.state.hasErrored) {
      return (
        <ErrorImageOverlay>
          <ErrorImageContainer imageUrl="https://http.cat/417.jpg" />
          <ErrorImageText>
            Sorry, something went wrong with your request, or this page is
            broken. Try reloading or go back to a different page
          </ErrorImageText>
        </ErrorImageOverlay>
      );
    }
    //otherwise, just render the children as normal
    return this.props.children;
  }
}

export default ErrorBoundary;
