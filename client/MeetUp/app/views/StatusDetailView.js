import React, { Component } from 'react';
import { Text, View } from 'react-native';

var MapView = require('react-native-maps');

export default class StatusDetailView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <View>
        <Text>Status Detail View</Text>
        <Text>{this.props.username}</Text>
        <MapView
          style={{
            height:100,
            width: 100
          }}
          region={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
          onRegionChange={this.onRegionChange}
        />
      </View>
    );
  }
}
