import React, { Component } from 'react';
import { Text, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import {MapStyle} from  "../Constants";
// var MapView = require('react-native-maps');

var MapView = require('react-native-maps');

export default class StatusDetailView extends Component {
  constructor(props) {
    super(props);
    this.state = {
        region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 100,
        longitudeDelta: 100,
      }
    }
  }

  onRegionChange(region) {
    this.setState({ region });
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
        />
      </View>
    );
  }
}
