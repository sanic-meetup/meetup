import React, { Component } from 'react';
import { AsyncStorage, View, Text, ScrollView, Button, TouchableOpacity,
  RefreshControl, Keyboard
} from 'react-native';
import 'react-native-vector-icons';
import { server } from '../Constants';
var SearchBar = require('react-native-search-bar');
var uuid = require('react-native-uuid');


export default class DiscoverTab extends Component {
  constructor(props) {
    super(props);
    // console.log("discover", props.username);
    this.state = {
      token: props.token,
      username: props.username,
      users: [],
      cstext: '',
      refresh: false
    };
  }

  //  try to retrive a logged in user from local storage on device
  getUsername = async (callback) => {
    try {
      const name = await AsyncStorage.getItem('username');
      const token = await AsyncStorage.getItem('token');
      if (name !== null && token !== null){
        // We have data!!
        callback({success: true, username: name, token: token});
      } else {
        console.warn("Login.js: username Not Set. Going back to login...");
        Actions.login();
      }
    } catch (error) {
      // Error retrieving data
      console.error(error);
    }
  }

  componentDidMount() {

    this.getUsername((res) => {
      if (res.success) {
        this.setState({username: res.username, token: res.token});
      }
    });

    //show keyboard
    this.refs.searchBar.focus();
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
    //hide the search bar after search
    this.refs.searchBar.unFocus();

    return fetch('https://'+server+'/api/users/?token='+this.state.token+"&username="+username, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })
      .then((response) => response.json())
      .then((responseJson) => {
        // console.warn("submitted form: "+JSON.stringify(responseJson));
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
          // console.warn(JSON.stringify(responseJson));
          if (!responseJson.ok) {
            // console.warn("setting state");
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
    if (following) return {color: "#B4CDCD", fontSize:20};
    return {color: "#0EBFE9", fontSize:20};
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

  //a workaround to hide keyboard on cancel
  hide_keyboard(){
    this.refs.searchBar.unFocus();
    // Keyboard.dismiss();
  }

  render() {
    //each user will be contained in this
    const createItem = (item) => (
      <View style={{
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 20,
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: '#d6d7da'
      }}
      key={uuid.v1()}
      >
        <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
           <Text
              style={{fontSize:20}}
            >
              {item.username}
           </Text>

           <TouchableOpacity disabled={item.follows} onPress={this.follow.bind(this, item.username)}>
            <Text style={this.get_followButton_bg(item.follows)}>
              {this.get_followButton_title(item.follows)}
            </Text>
           </TouchableOpacity>
         </View>
       </View>
    )

    //@TODO use the createItem with map(...) when kiwi makes backend method
    return (
      <View style={{flex:1, paddingTop: 20}}>
      <SearchBar
      	ref='searchBar'
        autoCapitalize="none"
      	placeholder='Search'
      	onChangeText={this._handleResults.bind(this)}
      	onSearchButtonPress={this.findUser.bind(this)}
        onCancelButtonPress={this.hide_keyboard.bind(this)}
        showsCancelButton={true}
        searchBarStyle='minimal'
      	/>

        <ScrollView
        onScroll={this.hide_keyboard.bind(this)}
        style={{flexDirection: 'column', flex: 1}}
        >

        {this.state.users.map(createItem)}
        </ScrollView>
      </View>
    );
  }
}
