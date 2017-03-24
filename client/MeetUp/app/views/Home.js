'use-strict'

import React, { Component } from 'react';
import { Text, View, ScrollView, AsyncStorage, LayoutAnimation } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import SetStatusInline from "../components/SetStatusInline";
import TabBar from "../components/TabBar";

import { AccountTab, DiscoverTab } from '../tabViews';

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
      username: props.username,
      user_status: undefined,
      updateFormOpen: false,
      statuses: undefined,
      tabViewSelected: 'Home'
    }
  }

  componentWillMount() {
    // Update statuses of people User follows.
    this.updateStatuses()
    setInterval(() => {this.updateStatuses()},2000);

    // Attempt to get the user's info.
    this.getUsername((res) => {
      if (res.success) { // on success...
        console.log("USERNAME",res.username);
        this.setState({username: res.username}); // set username in state
        this.following((json) => {
          this.setState({statuses: json}); // TODO: need to pull true statuses
        });
      } else { // couldn't get User's info
        console.warn("Couldn't get username... Back to login...");
        Actions.login();
      }
    });
  }

  // Determine if we should re-render
  shouldComponentUpdate(nextProps, nextState) {
    if (JSON.stringify(this.state) == JSON.stringify(nextState)) { // TODO: no string comparison
      return false;
    } return true;
  }

  updateStatuses() {
    this.following((json) => {
      this.setState({statuses: json});
    });
    this.getUserCurrentStatus((status) => { // get the users' status
      this.setState({user_status : status.status.availability});
      console.log(this.state.user_status);
    });
  }

  // Logic to handle status update events in navbar
  toggleStatusForm() {
    if (this.state.updateFormOpen) {
      this.setState({updateFormOpen: false});
      return;
    } this.setState({updateFormOpen: true});
    return;
  }

  //  try to retrive a logged in user from local storage on device
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

  // Get the User's status and update UI in callback()
  getUserCurrentStatus(callback) {
    return fetch('https://'+server+'/api/user/?token='+this.state.token+'&?username='+this.state.username, {
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

  // Get the statuses of all the users that User follows
  following(callback) {
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

  // Render the current selected tab
  _renderTab() {
    switch (this.state.tabViewSelected) {
    case 'Home':
      return (
        <View style={{flex: 1}}>
          <SetStatusInline open={this.state.updateFormOpen} token={this.state.token}/>
          <View style={{flex: 1, marginLeft: 10, marginRight: 10}}>
            <ScrollView>
              {this.renderCards()}
            </ScrollView>
          </View>
        </View>
      );
      break;
    case 'Search':
      return (
        <DiscoverTab/>
      );
      break;
    case 'Account':
      return (
        <AccountTab/>
      );
      break;
    default:
      return (<View><Text>No Tab Selected</Text></View>)

    }
  }

  _onTabPress = (tab) => {
    console.log(tab);
    this.setState({tabViewSelected: tab});
    console.log(this.state.tabViewSelected);
  }

  renderCards() {
    if (!this.state.statuses)
      return <Text>No statuses</Text>
    return (this.state.statuses.map((curr) => {return(<Card key={Math.random(36)} available={curr.status?(curr.status.availability=='Busy'?false:true):false} username={curr.username}/>)}));
  }

  render() {
    return (
      <View style={[{flex: 1}, styles.sceneContainer]}>
        <Navbar
          status_enabled={true}
          status={this.state.user_status}
          onPress={this.toggleStatusForm.bind(this)}
          rightButton={rightButtonConfig}
        />
        <TabBar tabSelected={this.state.tabViewSelected} onpress={this._onTabPress}>
        {this._renderTab()}
        </TabBar>
      </View>
    )
  }
};
