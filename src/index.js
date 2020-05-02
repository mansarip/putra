import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { ThemeProvider, defaultTheme } from "evergreen-ui";

/**
 * override default font
 */
const myTheme = { ...defaultTheme };
myTheme.typography.fontFamilies.display = "Jost";
myTheme.typography.fontFamilies.ui = "Jost";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider value={myTheme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
