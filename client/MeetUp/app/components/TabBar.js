import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import { colors } from '../Constants';

const home = (<Icon name="home" size={30} color={colors.black} />)
const search = (<Icon name="magnifying-glass" size={30} color={colors.black} />)
const account = (<Icon name="emoji-flirt" size={30} color={colors.black} />)

const styles = {
  tabBarContainer: {
    height: 50,
    backgroundColor: colors.white,
    borderColor: colors.black,
    borderTopWidth: 1,
  },
  tabBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  tabBarItem: {
    alignItems: 'center'
  }
}

export default class TabBar extends Component {
  constructor(props) {
    super(props);
  }

  _onTabPress = (tab) => {
    this.props.onpress(tab);
  }

  render() {
    return (
      <View style={{flex: 1}}>
        {this.props.children}
        <View style={styles.tabBarContainer}>
          <View style={styles.tabBar}>
            <TouchableOpacity onPress={this._onTabPress.bind(this, 'Home')} style={styles.tabBarItem}>{home}</TouchableOpacity>
            <TouchableOpacity onPress={this._onTabPress.bind(this, 'Search')} style={styles.tabBarItem}>{search}</TouchableOpacity>
            <TouchableOpacity onPress={this._onTabPress.bind(this, 'Account')} style={styles.tabBarItem}>{account}</TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}
