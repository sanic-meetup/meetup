import React, { Component } from 'react';
import Login from './views/Login';
import { Actions, Scene, Router } from 'react-native-router-flux';

/* ... */

export default class App extends React.Component {
  render() {
    return <Router>
      <Scene key="root">
        <Scene key="login" component={Login} title="Login"/>
      </Scene>
    </Router>
  }
}
