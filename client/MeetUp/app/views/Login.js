'use-strict'

import React, { Component } from 'react';
import { Button, Text, TextInput, View, AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Navbar from "../components/Navbar";

const PADDING = 10;
const MARGIN = 8;
const FORM_FIELD_FONT_SIZE = 20;
const FORM_FIELD_HEIGHT = FORM_FIELD_FONT_SIZE+(PADDING*2)+5;

const styles = {
  container: {
    backgroundColor: '#eeeeee'
  },
  inputField: {
    //backgroundColor: '#ffffff',
    padding: PADDING,
    marginTop: 10,
    height: FORM_FIELD_HEIGHT,
    fontSize: FORM_FIELD_FONT_SIZE,
  },
  borderWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: "#aaaaaa"
  },
  formContainer: {
    marginLeft: 24,
    marginRight: 24,
  }
}

export default class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    }
  }

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
  signIn(username, password) {
    console.log(username, password);
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
          if (responseJson.username)
            this.goToHome(responseJson.token);
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
    //this.goToHome(); // HACK: bypasses login
    return(
      <View style={[{flex: 1}, styles.container]}>
        <Navbar title="Login"/>
        <View style={styles.formContainer}>

          <Button onPress={this.goToHome.bind(this)} title="Go To Home"/>

          <View style={styles.borderWrapper}>
            <TextInput autoCapitalize={'none'} placeholder="username" onChangeText={text => this.setState({username: text})} style={styles.inputField}/>
          </View>
          <View style={styles.borderWrapper}>
            <TextInput autoCapitalize={'none'} placeholder="password" secureTextEntry={true} onChangeText={text => this.setState({password: text})} style={styles.inputField}/>
          </View>
          <Button onPress={this.signIn.bind(this, this.state.username, this.state.password)} title="Sign In"/>

        </View>
      </View>
    );
  }
}
