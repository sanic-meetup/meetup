'use-strict'

/**
* My custom Navbar
*/

import React, { Component, Stylesheet } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { colors } from '../Constants';

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
  avail : "🎉 Available",
  busy : "🚫 Busy"
}

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return <View style={[styles.navBarContainer]}>
      <View style={styles.statusBar}></View>
      <View style={[styles.navBar]}>
        <TouchableOpacity onPress={this.props.onPress} style={styles.customTitle}><Text style={styles.navBarTitleText}>{this.props.title || ""}</Text></TouchableOpacity>
      </View>
    </View>
  }
}
