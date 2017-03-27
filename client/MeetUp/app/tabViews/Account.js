import React, {Component} from 'react';
import {
   View, Text, TouchableOpacity, ScrollView, Button,
   AsyncStorage, StyleSheet, Alert
 } from 'react-native';
import { server } from '../Constants';
import { Actions } from 'react-native-router-flux';

export default class AccountTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: props.token,
      username: props.username,
      accinfo: undefined,
      followerView: false,
    };
  }

  componentWillMount() {
    this.getAccInfo((json) => { // get the users' status
      this.setState({accinfo : json});
    });
  }

  // Determine if we should re-render
  shouldComponentUpdate(nextProps, nextState) {
    if (JSON.stringify(this.state) == JSON.stringify(nextState)) { // TODO: no string comparison
      return false;
    } return true;
  }

  getAccInfo(callback) {
    return fetch('https://'+server+'/api/users/?token='+this.state.token, {
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

  _getFollowers(){
    Actions.account_followers({token: this.state.token, username: this.state.username});
  }

  _getFollowing(){
    Actions.account_following({token: this.state.token, username: this.state.username});
  }

  _logout(){
    AsyncStorage.removeItem('token', function() {
      Actions.login();
    });
  }

  _accInfo() {
    var alert_body = 'username: '+this.state.username
    +"\n email: "+ this.state.accinfo.email
    +"\n status: "+ JSON.stringify(this.state.accinfo.status)
    +"\n location: "+this.state.accinfo.location.address;
    Alert.alert(
      'Account Info.',
      alert_body,
      [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      { cancelable: false }
    )
  }

  render() {
    if (this.state.accinfo === undefined) {
      var accinfo = "no info";
    } else {
      accinfo = this.state.accinfo;
    }

    return (
        <View style={{flex:1, paddingTop: 20}}>
        <ScrollView
        centerContent
        >
        <TouchableOpacity
        style={styles.button}
        activeOpacity={0.3}
        onPress={this._accInfo.bind(this)}>
              <Text style={styles.text}>Account Info.</Text>
        </TouchableOpacity>

          <TouchableOpacity
          style={styles.button}
          activeOpacity={0.3}
          onPress={this._getFollowers.bind(this)}>
                <Text style={styles.text}>Followers</Text>
          </TouchableOpacity>

          <TouchableOpacity
          style={styles.button}
          activeOpacity={0.3}
          onPress={this._getFollowing.bind(this)}>
                <Text style={styles.text}>Following</Text>
          </TouchableOpacity>

          <Button
            onPress={this._logout}
            title="Sign Out"
            style={{fontSize:20}}
            color="#ff0033"
          />
        </ScrollView>
        </View>
      );
  }
}

/*mostly taken from react-native listview docs, with some mods mods*/
var styles = StyleSheet.create({
  scrollView: {
    flexDirection: 'column',
    backgroundColor: '#6A85B1',
    height: '100%',
    justifyContent: 'center'
  },
  text: {
    fontSize: 20,
    color: '#888888'
  },
  button: {
    margin: 7,
    padding: 7,
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 3,
  }
});
