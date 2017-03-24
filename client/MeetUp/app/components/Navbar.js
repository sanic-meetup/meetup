'use-strict'

/**
* My custom Navbar
*/

import React, { Component, Stylesheet } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { colors, server } from '../Constants';

const NAV_BAR_HEIGHT = 44;
const STATUS_BAR_HEIGHT = 20;

/**
* Styles - basically stolen from react-native-navbar.
* so credit where credit is due.
*/
const styles = {
  navBarContainer: {
    backgroundColor: colors.white,
  },
  statusBar: {
    height: STATUS_BAR_HEIGHT,
  },
  navBar: {
    height: NAV_BAR_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  customTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 7,
    alignItems: 'center',
  },
  navBarButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  navBarButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBarButtonText: {
    fontSize: 17,
    letterSpacing: 0.5,
  },
  navBarTitleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBarTitleText: {
    fontSize: 17,
    letterSpacing: 0.5,
    color: colors.black,
    fontWeight: '500',
  },
};

const strings = {
  avail : "Available 🎉",
  busy : "Busy 🚫",
  unset : "Set your status!"
}

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: props.status || undefined
    }
  }

  componentWillReceiveProps(nextProps) {
    var text = this.props.status_enabled?this.state.status:this.props.title;
    if (this.props.status_enabled) {
      if (nextProps.status === "Available")
        text = strings.avail;
      else if (nextProps.status === "Busy")
        text = strings.busy;
    }
    this.setState({status: text});
  }

  componentWillMount() {}

  // Get the User's status and update UI in callback()
  getUserCurrentStatus(callback) {
    return fetch('https://'+server+'/api/user/?token='+this.state.token+'&?username='+this.state.username, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })
      .then((response) => response.json())
      .then((responseJson) => {
        callback(responseJson);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  _onPress() {
    this.props.onPress();
  }

  // Logic for rendering the correct title of the Navbar.
  _renderTitle() {
    return (
      <TouchableOpacity onPress={this._onPress.bind(this)} style={styles.customTitle}>
        <Text style={styles.navBarTitleText}>{this.state.status}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    return <View style={[styles.navBarContainer]}>
      <View style={styles.statusBar}></View>
      <View style={[styles.navBar]}>
        { this._renderTitle() }
      </View>
    </View>
  }
}
