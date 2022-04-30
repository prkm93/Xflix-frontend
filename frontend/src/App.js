
import React from "react";
import VideoGrid from "./components/VideoGrid";
import VideoDetails from "./components/VideoDetails";
import { Route, Switch } from "react-router-dom";
import "./App.css";

export const config = {
  endpoint: `https://24cfea2d-b57e-422b-99d4-390ad149e450.mock.pstmn.io/v1`,
};

function App() {

  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={VideoGrid}/>
        <Route exact path="/video/:id" component={VideoDetails}/>
      </Switch>
    </div>
  );
}

export default App;
