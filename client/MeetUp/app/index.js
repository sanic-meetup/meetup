import React, { Component } from 'react';
import { Actions, Scene, Router } from 'react-native-router-flux';

// Scene's
import Login from './views/Login';
import Home from './views/Home';

/* ... */

export default class App extends React.Component {
  render() {
    return <Router>
      <Scene key="root" hideNavBar={true}>
        <Scene key="home" component={Home} title="Home"/>
        <Scene key="login" component={Login} title="Login"/>
      </Scene>
    </Router>
  }
}
