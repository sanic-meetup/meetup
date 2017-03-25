import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
var SearchBar = require('react-native-search-bar');
import 'react-native-vector-icons';
import { server } from '../Constants';

export default class DiscoverTab extends Component {
  constructor(props) {
    super(props);
    console.log("discover", props.username);
    this.state = {
      token: props.token,
      username: props.username,
      users: []
    };
  }

  componentWillMount() {
    //todo
  }

  // Determine if we should re-render
  shouldComponentUpdate(nextProps, nextState) {
    if (JSON.stringify(this.state) == JSON.stringify(nextState)) { // TODO: no string comparison
      return false;
    } return true;
  }

  /**
  * find a user
  */
  findUser(username, callback) {
    console.warn(JSON.stringify(this.props.token));
    return fetch('https://'+server+'/api/users/?token='+this.state.token+"&username="+username, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.warn(JSON.stringify(responseJson));
        this.setState({users: responseJson.username});
      })
      .catch((error) => {
        console.error(error);
      });
  }

  _handleResults(results) {
    // this.setState({ results });
    //@TODO:https://www.npmjs.com/package/react-native-searchbar
    // console.warn(results);
  }

  render() {
    //each user will be contained in this
    const createItem = (item) => (
      <View>
       <Text
          // key={item.id}
          style="">
          {item}
       </Text>
       </View>
    )
    //@TODO use the createItem with map(...) when kiwi makes backend method
    return (
      //search bar
      <View style={{flex:1}}>
      <SearchBar
      	ref='searchBar'
      	placeholder='Search'
      	onChangeText={this._handleResults.bind(this)}
      	onSearchButtonPress={this.findUser.bind(this)}
      	// onCancelButtonPress={...}
      	/>
        <ScrollView>
        <Text>{this.state.users}</Text>
        </ScrollView>
      </View>
    );
  }
}
