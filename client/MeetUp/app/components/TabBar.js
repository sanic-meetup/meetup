import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
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

  _onTabPress(tab) {
    //this.props.onpress(tab);
    switch (tab) {
    case 'Home':
      Actions.pop(this.props);
      Actions.home();
      break;
    case 'Discover':
      Actions.pop(this.props);
      Actions.discover();
      break;
    case 'Account':
      Actions.pop(this.props);
      Actions.account();
      break;
    }
  }

  // {this.props.children.map(scene => React.createElement(scene.component))}

  render() {
    return (
      <View style={{flex: 1}}>

        {React.createElement(this.props.children[this.props.children.length - 1].component)}

        <View style={styles.tabBarContainer}>
          <View style={styles.tabBar}>
            <TouchableOpacity onPress={this._onTabPress.bind(this, 'Home')} style={styles.tabBarItem}>{home}</TouchableOpacity>
            <TouchableOpacity onPress={this._onTabPress.bind(this, 'Discover')} style={styles.tabBarItem}>{search}</TouchableOpacity>
            <TouchableOpacity onPress={this._onTabPress.bind(this, 'Account')} style={styles.tabBarItem}>{account}</TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}
