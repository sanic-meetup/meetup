import React, { Component } from 'react';
import { View, Text } from 'react-native';
var SearchBar = require('react-native-search-bar');

export default class DiscoverTab extends Component {
  constructor(props) {
    super(props);
  }

  /**
  * find a user
  */
  findUser(username, callback) {
    return fetch('https://'+server+'/api/users/?token='+this.state.token+"username="+username, {
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

  render() {
    return (
      <View style={{flex: 1}}>
        <SearchBar
        	ref='searchBar'
        	placeholder='Search'
        	onChangeText={console.warn("change")}
        	onSearchButtonPress={console.warn("submit")}
        	onCancelButtonPress={console.warn("cancel")}
        />
        <Text>Discover Tab</Text>
      </View>
    );
  }
}
