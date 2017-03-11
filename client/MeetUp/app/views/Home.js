'use-strict'

import React, { Component } from 'react';
import { Text, View, ScrollView } from 'react-native';
import Navbar from "../components/Navbar";
import Card from "../components/Card";


const styles = {
  sceneContainer: {
    backgroundColor: "#eeeeee"
  }
};

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.token = props.data;
  }

  following() {
    return fetch('https://localhost:3000/api/following/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: this.token,
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

  render() {
    return <View style={[{flex: 1}, styles.sceneContainer]}>
        <Navbar title="Home"/>
        <View style={{flex: 1, marginLeft: 10, marginRight: 10}}>
          <ScrollView>
            <Card available={true}/>
            <Card available={false}/>
          </ScrollView>
        </View>
      </View>
  }
};
