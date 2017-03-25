import React, { Component } from 'react';
import { View, Text } from 'react-native';
import SearchBar from 'react-native-searchbar';

export default class DiscoverTab extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    //todo
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

  _handleResults(results) {
    // this.setState({ results });
    //@TODO:https://www.npmjs.com/package/react-native-searchbar
    console.log();
  }

  render() {
    return (
        <Text>Discover Tab</Text>
      </View>
    );
  }
}
