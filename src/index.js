import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter as Router} from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { createTheme, MuiThemeProvider } from '@material-ui/core';
//import * as Sentry from "@sentry/react";
//import { Integrations } from "@sentry/tracing";

// if (process.env.REACT_APP_ENV == "production") {
//     Sentry.init({
//       dsn: "https://10fe6811a7254d68b65bf65e09d5f602@debug.sariska.io/2",
//       integrations: [new Integrations.BrowserTracing()],

//       // Set tracesSampleRate to 1.0 to capture 100%
//       // of transactions for performance monitoring.
//       // We recommend adjusting this value in production
//       tracesSampleRate: 1.0,
//     });
// }

const THEME = createTheme({
  typography: {
   "fontFamily": `'DM Sans', sans-serif`,
  }
});

ReactDOM.render(
  <React.StrictMode>
    <MuiThemeProvider theme={THEME}>
      <Router>
        <Provider store={store}>
          <App />
        </Provider>
      </Router>
    </MuiThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
