'use-strict'

import React, { Component } from 'react';
import { Button, Text, TextInput, View, AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { server } from '../Constants';
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
      password: "",
      email: ""
    }
  }

  /**
  * Helper method to check if the user has a token set.
  */
  authenticateUser = async (callback) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const name = await AsyncStorage.getItem('username');
      if (token !== null){
        // We have data!!
        callback({success: true, token: token, username: name})
      }
        //console("Login.js: User Token Not Set.");
    } catch (error) {
      // Error retrieving data
      console.log(error);
    }
  }

  // /users/
  createNewUser(username, password, email) {
    if (username === "" && password === "" && email === "" || (!email || !password || !username))
      return
    return fetch('https://'+server+'/users/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
          email: email
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.response === 'Unauthorized' || !responseJson.username)
          return;

        this.signIn(username, password);

      })
      .catch((error) => {
        //consoleor(error);
      });
  }

  /**
  * Sign in a user
  */
  signIn(username, password) {
    console.log(username, password);
    return fetch('https://'+server+'/signin/', {
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
        if (responseJson.response === 'Unauthorized')
          return
        try {
          AsyncStorage.setItem('username', responseJson.username);
          AsyncStorage.setItem('token', responseJson.token);
          console.log(responseJson.username);
          if (responseJson.username)
            this.goToHome({token: responseJson.token});
        } catch (error) {
          //consoleor(error);
        }
      })
      .catch((error) => {
        //consoleor(error);
      });
  }

  goToHome(props) {
    Actions.tabbar(props);
  }

  goToLogin() {
    Actions.login();
  }

  componentDidMount() {
    this.authenticateUser((res) => {
      if (res.success) {
        fetch('https://'+server+'/api/testauth?token=' + res.token, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            }
          })
          .then((response) => response.json())
          .then((responseJson) => {
            if (responseJson.success) {
              console.log("Success! We got a token!");
              this.goToHome({token: res.token, username: res.username});
            }
          })
          .catch((error) => {
            //consoleor(error);
          });
      } else console.log("User not authenticated.")
    });


  }

  render() {
    return(
      <View style={[{flex: 1}, styles.container]}>
        <Navbar title="Sign Up" status_enabled={false}/>
        <View style={styles.formContainer}>

          <View style={styles.borderWrapper}>
            <TextInput autoCapitalize={'none'} placeholder="username" onChangeText={text => this.setState({username: text})} style={styles.inputField}/>
          </View>
          <View style={styles.borderWrapper}>
            <TextInput autoCapitalize={'none'} placeholder="password" secureTextEntry={true} onChangeText={text => this.setState({password: text})} style={styles.inputField}/>
          </View>

          <View style={styles.borderWrapper}>
            <TextInput autoCapitalize={'none'} keyboardType="email-address" placeholder="email" onChangeText={text => this.setState({email: text})} style={styles.inputField}/>
          </View>

          <View style={{flexDirection:'row', justifyContent:"center"}}>
            <Button onPress={this.createNewUser.bind(this, this.state.username, this.state.password, this.state.email)} title="Sign Up"/>
            <Button onPress={this.goToLogin.bind(this)} title="back"/>
          </View>
        </View>
      </View>
    );
  }
}
