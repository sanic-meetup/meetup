import React, { Component } from 'react';
import { Text, View } from 'react-native';
import Navbar from "../components/Navbar";

export default class Login extends React.Component {
  render() {
    return(
      <View style={{flex: 1}}>
        <Navbar/>
        <Text>Test</Text>
      </View>
    );
  }
}
