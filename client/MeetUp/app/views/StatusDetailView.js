import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { MapStyle } from  "../Constants";
import Navbar from "../components/Navbar";
var MapView = require('react-native-maps');

export default class StatusDetailView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: props.location,
      latitudeDelta: 100,
      longitudeDelta: 100,
      token: this.props.token
    }
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  componentWillMount() {
    //todo
  }


  render() {
    return(
      <View style={{flex:1}}>
      <Navbar title={this.props.username} status_enabled={false}/>
        {/* Display location if exists in state */}
        {this.state.location?(<MapView
            showsIndoors={true}
            scrollEnabled={false}
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
          >
          <MapView.Marker
            coordinate={{
               latitude: this.state.location.latitude,
               longitude: this.state.location.longitude
             }}
            title={this.props.username+"'s location"}
            description={
              this.state.location.address ?
               this.state.location.address: "Uknown Address"
             }
          />
        </MapView>):(<Text>No location</Text>)}
      </View>
    );
  }
}
