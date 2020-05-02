import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PageMain from "./PageMain";
import PageQR from "./PageQR";

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <PageMain />
        </Route>

        <Route exact path="/qr">
          <PageQR />
        </Route>
      </Switch>
    </Router>
  );
}
