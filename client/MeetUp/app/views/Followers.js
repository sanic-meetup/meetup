import React, {Component} from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { server } from '../Constants';
import { Actions } from 'react-native-router-flux';

export default class Followers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: props.token,
      username: props.username,
      followers: undefined
    };
  }

  componentWillMount() {
    this.getFollowers((json) => { // get the users' status
      this.setState({followers : json.followers});
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
    const createItem = (item) => (
       <Text
          key={item.id}
          style={styles.item}>
          {item}
       </Text>
    )

    return (
        <View style={styles.container}>
        <ScrollView>
          {["kiwk", "yourmom"].map(createItem)}
        </ScrollView>
        </View>
      );
  }
}

const styles = StyleSheet.create ({
 container: {
    marginTop: 50,
    height: 500,
    backgroundColor: 'silver'
 },
 item: {
    margin: 15,
    padding: 15,
    height: 40,
    borderColor: 'red',
    borderWidth: 1
 }
})
