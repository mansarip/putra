import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PageMain from "./PageMain";
import PageQR from "./PageQR";
import PageNewQR from "./PageNewQR";
import PageQRShow from "./PageQRShow";
import PageScanner from "./PageScanner";
import PageLogs from "./PageLogs";
import PageLogDetails from "./PageLogDetails";
import PageLogSearch from "./PageLogsSearch";
import PageAbout from "./PageAbout";

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

        <Route exact path="/scanner">
          <PageScanner />
        </Route>

        <Route exact path="/logs">
          <PageLogs />
        </Route>

        <Route exact path="/logs/detail">
          <PageLogDetails />
        </Route>

        <Route exact path="/logs/search">
          <PageLogSearch />
        </Route>

        <Route exact path="/about">
          <PageAbout />
        </Route>
      </Switch>
    </Router>
  );
}
