import React, {Component} from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { server } from '../Constants';
import { Actions } from 'react-native-router-flux';

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
      console.warn(json);
      this.setState({following : json});
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
        console.error(error);
      });
  }

  render() {
    if (this.state.following === []) {
      console.warn(this.state.following);
      return (<View>
        <Text>You are not Following anyone</Text>
        </View>)
    }
    const createItem = (item) => (
       <Text
          key={item.id}
          style={styles.cardContainer}>
          {item.username}
       </Text>
    )

    return (
        <View style={{flex:1}}>
        <ScrollView>
          {this.state.following.map(createItem)}
        </ScrollView>
        </View>
      );
  }
}
const styles = {
  cardContainer: {
    marginTop: 4,
    marginBottom: 4,
    borderRadius: 8,
    backgroundColor: 'white',
    borderBottomWidth: 4,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: '#e9e9e9',
  },
  contentContainer: {
    padding: 8,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  profileImageContainer: {
    position: 'relative',
    width: 40,
  },
  available: {
    borderColor: 'white',
    borderWidth: 2,
    backgroundColor: 'rgb(76, 217, 100)',
  },
  busy: {
    borderColor: 'white',
    borderWidth: 2,
    backgroundColor: 'rgb(255, 59, 48)',
  },
  profileImageStatus: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 7,
    width: 14,
    height: 14,
    zIndex: 10,
  },
  cardContext: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 8,
  },
  username: {

  },
  locationName: {

  }
};
