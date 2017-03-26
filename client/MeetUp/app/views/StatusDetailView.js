import React, { Component } from 'react';
import { Text, View } from 'react-native';

export default class StatusDetailView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <View>
        <Text>Status Detail View</Text>
        <Text>{this.props.username}</Text>
      </View>
    );
  }
}
