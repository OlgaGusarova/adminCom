import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';
import store from './redux/Store';
import './style/style.css';
import MainRoute from './components/MainRoute';

const history = createBrowserHistory();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <MainRoute/>
        </Router>
      </Provider>
    );
  }
}

export default App;
