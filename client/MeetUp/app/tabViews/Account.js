import React, {Component} from 'react';
import { View, Text, TouchableOpacity, Button } from 'react-native';
import { server } from '../Constants';
import { Actions } from 'react-native-router-flux';

export default class AccountTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: props.token,
      username: props.username,
      info: undefined,
      followerView: false
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
    return fetch('https://'+server+'/api/user/?token='+this.state.token, {
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
    Actions.followers({token: this.state.token, username: this.state.username});
  }

  render() {
    if (this.state.accinfo === undefined) {
      var accinfo = "no info";
    } else {
      accinfo = this.state.accinfo;
    }

    return (
        <View>
        <TouchableOpacity activeOpacity={0.3} onPress={this._getFollowers.bind(this)}>
          <View>
              <Text>Followers</Text>
          </View>
        </TouchableOpacity>
        <Text>other options</Text>
        </View>
      );
  }
}
