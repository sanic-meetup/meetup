import React, { Component } from 'react';
import { View, Text, ScrollView, Button, TouchableOpacity, RefreshControl} from 'react-native';
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
      users: [],
      cstext: '',
      refresh: false
    };
  }

  componentWillMount() {
    //todo
    console.log(this.props.token);
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
    return fetch('https://'+server+'/api/users/?token='+this.state.token+"&username="+username, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.warn("submitted form: "+JSON.stringify(responseJson));
        this.setState({users: [responseJson]});
      })
      .catch((error) => {
        console.error(error);
      });
  }

  _handleResults(username) {
    // this.setState({ results });
    //@TODO:https://www.npmjs.com/package/react-native-searchbar
    // console.warn(results);
    if (username) {
      return fetch('https://'+server+'/api/users/search/?token='+this.state.token+"&limit=10&username="+username, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        })
        .then((response) => response.json())
        .then((responseJson) => {
          console.warn(JSON.stringify(responseJson));
          if (!responseJson.ok) {
            console.warn("setting state");
            this.setState({users: responseJson, cstext: username});
          } else {
            this.setState({users: []});
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else this.setState({users: []});
  }

  get_followButton_title(following) {
    if (following) return "Following";
    return "Follow";
  }

  get_followButton_bg(following) {
    if (following) return "#B4CDCD";
    return "#0EBFE9";
  }

  follow(username) {
    return fetch('https://'+server+'/api/users/follow/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          token: this.state.token
        })
      })
      .then((response) => response)
      .then((responseJson) => {
        //@TODO refresh using same cstext (current search text)
        this._handleResults(this.state.cstext);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    //each user will be contained in this
    const createItem = (item) => (
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
         <Text
            key={item.id}
            style=''
          >
            {item.username}
         </Text>

         <TouchableOpacity disabled={item.follows} onPress={this.follow.bind(this, item.username)}>
          <Text style= {{backgroundColor: this.get_followButton_bg(item.follows)}}>
            {this.get_followButton_title(item.follows)}
          </Text>
         </TouchableOpacity>
       </View>
    )

    //@TODO use the createItem with map(...) when kiwi makes backend method
    return (
      //search bar
      <View style={{flex:1, paddingTop: 20}}>
      <SearchBar
      	ref='searchBar'
        autoCapitalize="none"
      	placeholder='Search'
      	onChangeText={this._handleResults.bind(this)}
      	onSearchButtonPress={this.findUser.bind(this)}
      	// onCancelButtonPress={...}
      	/>
        <ScrollView>
        {this.state.users.map(createItem)}
        </ScrollView>
      </View>
    );
  }
}
