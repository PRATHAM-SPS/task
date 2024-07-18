import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ObjectList from "./components/ObjectList";
import ObjectDetail from "./components/ObjectDetail";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={ObjectList} />
        <Route path="/objects/:name" component={ObjectDetail} />
      </Switch>
    </Router>
  );
};

export default App;
