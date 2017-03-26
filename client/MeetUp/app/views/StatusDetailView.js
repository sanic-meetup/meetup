import React, { Component } from 'react';
import { Text, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import {MapStyle} from  "../Constants";
// var MapView = require('react-native-maps');

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
          region={this.state.region}
          provider={PROVIDER_GOOGLE}
          onRegionChange={this.onRegionChange}
          customMapStyle={this.mapStyle}
        />
      </View>
    );
  }
}
