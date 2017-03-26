import React, { Component } from 'react';
import { Text, View } from 'react-native';
import {MapStyle} from  "../Constants";
// var MapView = require('react-native-maps');

var MapView = require('react-native-maps');

export default class StatusDetailView extends Component {
  constructor(props) {
    super(props);
    console.log("Status detail props",props.location);
    this.state = {
        region: {
          latitude: props.location.latitude,
          longitude: props.location.longitude,
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
      <View style={{flex:1}}>
        <Text>Status Detail View</Text>
        <Text>{this.props.username}</Text>
        <MapView
          style={{
            flex:1,
            alignSelf: 'stretch',
          }}
          region={{
            latitude: this.props.location.latitude,
            longitude: this.props.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}>
          <MapView.Marker
            coordinate={{
               latitude: this.state.region.latitude,
               longitude: this.state.region.longitude
             }}
            title="testmarker"
            description="a description"
          />
        </MapView>
      </View>
    );
  }
}
