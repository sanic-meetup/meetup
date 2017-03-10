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
  }

  render() {
    return <View style={[{flex: 1}, styles.sceneContainer]}>
        <Navbar title="Home"/>
        <ScrollView>
          <Card/>
        </ScrollView>
      </View>
  }
};
