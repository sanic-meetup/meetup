import React, {Component} from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { server } from '../Constants';
import { Actions } from 'react-native-router-flux';
import Navbar from "../components/Navbar";
var uuid = require('react-native-uuid');

export default class Followers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: props.token,
      username: props.username,
      followers: []
    };
  }

  componentWillMount() {
    this.getFollowers((json) => { // get the users' status
      this.setState({followers : json.followers});
    });
  }

  checkFollows(username) {
    return fetch('https://'+server+'/api/following/check/?username='+username
      +'&token='+this.state.token, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson.follows;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // Determine if we should re-render
  shouldComponentUpdate(nextProps, nextState) {
    if (JSON.stringify(this.state) == JSON.stringify(nextState)) { // TODO: no string comparison
      return false;
    } return true;
  }

  /**
  * Sign in a user
  */
  getFollowers(callback) {
    return fetch('https://'+server+'/api/followers/?token='+this.state.token, {
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
    if (this.state.followers === []) {
      return (<View>
        <Text>You have no Followers</Text>
        </View>)
    }
    const createItem = (item) => (
      <View style={{
        flexDirection:'row',
        justifyContent: 'center',
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: '#d6d7da',
        padding: 15
      }}
      key={uuid.v1()}
      >
       <Text
          style={{
            fontSize:20,
          }}>
          {item}
       </Text>
       </View>
    )

    return (
        <View style={{flex:1}}>
        <Navbar title="Followers" status_enabled={false}/>
        <ScrollView>
          {this.state.followers.map(createItem)}
        </ScrollView>
        </View>
      );
  }
}
