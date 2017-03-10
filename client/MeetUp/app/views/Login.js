'use-strict'

import React, { Component } from 'react';
import { Button, Text, TextInput, View, AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Navbar from "../components/Navbar";

const styles = {
  container: {
    backgroundColor: "#eeeeee"
  }
}

export default class Login extends React.Component {

  /**
  * Helper method to check if the user has a token set.
  */
  authenticateUser = async (callback) => {
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null){
        // We have data!!
        callback({success: true, token: value})
      } else
        console.warn("Login.js: User Token Not Set.");
    } catch (error) {
      // Error retrieving data
      console.error(error);
    }
  }

  _login() {
    return fetch('https://localhost:3000/users/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: AsyncStorage.getItem('token'),
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  /**
  * Sign in a user
  */
  _signIn(username, password) {
    return fetch('http://localhost:5000/signin/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        try {
          AsyncStorage.setItem('username', responseJson.username);
          AsyncStorage.setItem('token', responseJson.token);
        } catch (error) {
          console.error(error);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  goToHome(props) {
    Actions.home(props);
  }

  componentDidMount() {
    this.authenticateUser((res) => {
      if (res.success) {
        fetch('http://localhost:5000/api/testauth?token=' + res.token, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            }
          })
          .then((response) => response.json())
          .then((responseJson) => {
            if (responseJson.success)
              this.goToHome(res.token);
          })
          .catch((error) => {
            console.error(error);
          });
      } else console.log("User not authenticated.")
    });


  }

  render() {
    return(
      <View style={[{flex: 1}, styles.container]}>
        <Navbar title="Login"/>
        <View>
          <TextInput/>
          <Button onPress={this.goToHome.bind(this)} title="Go To Home"/>
        </View>
      </View>
    );
  }
}
