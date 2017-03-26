import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { MapStyle } from  "../Constants";
var MapView = require('react-native-maps');

export default class StatusDetailView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: props.location,
      latitudeDelta: 100,
      longitudeDelta: 100,
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

        {/* Display location if exists in state */}
        {this.state.location?(<MapView
            style={{
              flex:1,
              alignSelf: 'stretch',
            }}
            region={{
              latitude: this.state.location.latitude,
              longitude: this.state.location.longitude,
              latitudeDelta: 0.00922,
              longitudeDelta: 0.00421
            }}
          />)
          :(<Text>No location</Text>)}

      </View>
    );
  }
}
