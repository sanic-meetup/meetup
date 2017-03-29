import React, {Component} from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { server } from '../Constants';
import { Actions } from 'react-native-router-flux';
import Navbar from "../components/Navbar";

export default class Following extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: props.token,
      username: props.username,
      following: []
    };
  }

  componentWillMount() {
    this.getFollowing((json) => { // get the users' status
      //console.warn(json);
      this.setState({following : json});
    });
  }

  // Determine if we should re-render
  shouldComponentUpdate(nextProps, nextState) {
    if (JSON.stringify(this.state) == JSON.stringify(nextState)) { // TODO: no string comparison
      return false;
    } return true;
  }

  unfollow(username) {
    return fetch('https://'+server+'/api/users/unfollow/', {
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
        this.getFollowing((json) => { // get the users' status
          this.setState({following : json});
        });
      })
      .catch((error) => {
        //console.error(error);
      });
  }

  /**
  * Sign in a user
  */
  getFollowing(callback) {
    return fetch('https://'+server+'/api/following/?token='+this.state.token, {
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
        //console.error(error);
      });
  }

  render() {
    if (this.state.following === []) {
      //console.warn(this.state.following);
      return (<View>
        <Text>You are not Following anyone</Text>
        </View>)
    }

    const createItem = (item) => (
      /**
      *items each have status as well!
      */
      <View style={{
        padding: 15, flexDirection: 'column',
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: '#d6d7da'
      }}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
         <Text
            key={item.id}
            style={{fontSize: 20}}>
            {item.username}
         </Text>
         <TouchableOpacity onPress={this.unfollow.bind(this, item.username)}>
          <Text style= {{fontSize:20, color: "#ff0033"}}>
            Unfollow
          </Text>
         </TouchableOpacity>
         </View>
       </View>
    )

    return (
        <View style={{flex:1, paddingTop: 20}}>
        <Navbar title="Following" status_enabled={false}/>
        <ScrollView
        style={{flexDirection: 'column'}}
        >
          {this.state.following.map(createItem)}
        </ScrollView>
        </View>
      );
  }
}
