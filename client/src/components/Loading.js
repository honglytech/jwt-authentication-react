/**
 * This container shows a loading animation
 */
import React from 'react';
class Loading extends React.Component {
  render() {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        LOADING
      </div>
    );
  }
}

export default Loading