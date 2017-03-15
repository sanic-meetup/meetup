'use-strict'

import React, { Component } from 'react';
import { Text, View, ScrollView, AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import SetStatusInline from "../components/SetStatusInline";
import { server } from '../Constants';


const styles = {
  sceneContainer: {
    backgroundColor: "#eeeeee"
  }
};

const rightButtonConfig = {
  'title': "status",
  handler: () => {

  }
};

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: props.token,
      updateFormOpen: false,
      statuses: undefined
    }
  }

  componentWillMount() {
    setInterval(() => {this.updateStatuses()},2000);
    this.getUsername((res) => {
      if (res.success) {
        console.log("USERNAME",res.username);
        this.setState({username: res.username});
        this.following((json) => {
          this.setState({statuses: json}); // TODO: need to pull true statuses
        });
      } else {
        console.warn("Couldn't get username... Back to login...");
        Actions.login();
      }
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (JSON.stringify(this.state) == JSON.stringify(nextState)) { // TODO: no string comparison
      return false;
    } console.log("Updating!");return true;
  }

  updateStatuses() {
    this.following((json) => {
      this.setState({statuses: json});
    });
  }

  toggleStatusForm() {
    console.log(this.state.updateFormOpen);
    if (this.state.updateFormOpen) {
      this.setState({updateFormOpen: false});
      return;
    } this.setState({updateFormOpen: true});
    return;
  }

  getUsername = async (callback) => {
    try {
      const value = await AsyncStorage.getItem('username');
      if (value !== null){
        // We have data!!
        callback({success: true, username: value});
      } else {
        console.warn("Login.js: username Not Set. Going back to login...");
        Actions.login();
      }
    } catch (error) {
      // Error retrieving data
      console.error(error);
    }
  }

  following(callback) {
    return fetch('http://'+server+'/api/following/?token='+this.state.token, {
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

  renderCards() {
    if (!this.state.statuses)
      return <Text>No statuses</Text>
    return (this.state.statuses.map((curr) => {return(<Card key={Math.random(36)} available={curr.status?(curr.status.availability=='Busy'?false:true):false} username={curr.username}/>)}));
  }

  render() {
    return <View style={[{flex: 1}, styles.sceneContainer]}>
        <Navbar onPress={this.toggleStatusForm.bind(this)} title="MeetUp" rightButton={rightButtonConfig}/>
        <SetStatusInline open={this.state.updateFormOpen} token={this.state.token}/>
        <View style={{flex: 1, marginLeft: 10, marginRight: 10}}>
          <ScrollView>
            {this.renderCards()}
          </ScrollView>
        </View>
      </View>
  }
};
