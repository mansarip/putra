import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PageMain from "./PageMain";
import PageQR from "./PageQR";
import PageNewQR from "./PageNewQR";
import PageQRShow from "./PageQRShow";

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

        <Route exact path="/qr/new">
          <PageNewQR />
        </Route>

        <Route exact path="/qr/show">
          <PageQRShow />
        </Route>
      </Switch>
    </Router>
  );
}
