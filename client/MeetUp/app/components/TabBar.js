import React, { Component } from 'react';
import { Text, View } from 'react-native';

const styles = {
  tabBarContainer: {
    height: 50,
    backgroundColor: '#333'
  }
}

export default class TabBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.tabBarContainer}>
      </View>
    )
  }
}
