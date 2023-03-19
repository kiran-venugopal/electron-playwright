import * as React from "react";
import * as ReactDOM from "react-dom";

const App = () => {
  return (
    <>
      <h2>Hello from React </h2>
      <button onClick={() => window.API.dispatchEvent("start_recording")}>
        Start
      </button>
    </>
  );
};

function render() {
  ReactDOM.render(<App />, document.body);
}

render();
