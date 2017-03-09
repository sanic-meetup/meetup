import React, { Component } from 'react';
import { Text, View } from 'react-native';

const styles = {
  cardContainer: {
    margin: 8,
    height: 200,
    borderRadius: 8,
    backgroundColor: 'black',
  },
};

export default class Card extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <View style={[styles.cardContainer]}></View>
  }
};
