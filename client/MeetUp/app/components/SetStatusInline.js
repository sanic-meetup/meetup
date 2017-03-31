'use-strict'

import React, { Component } from 'react';
import { Button, Text, TouchableOpacity, View, ScrollView, AsyncStorage, Animated, LayoutAnimation } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { colors, server } from '../Constants';

const styles = {
  sceneContainer: {
    backgroundColor: "#1C345F",
    padding: 10,
    paddingTop: 20,
    height: 100,
  },
  availabilityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  availButton: {
    borderColor: colors.white,
    borderWidth: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 4,
    paddingBottom: 4,
    borderRadius: 15,
  },
  availButtonTrue: {
    marginLeft: 20,
  },
  availButtonFalse: {
    marginRight: 20,
  },
  availButtonText: {
    color: colors.white,
    fontSize:16,
  },
  selected: {
    backgroundColor: colors.white
  },
  availButtonselectedText: {
    color: colors.primary,
  }
};

const CustomLayoutAnimation = {
  duration: 200,
  create: {
    type: LayoutAnimation.Types.linear,
    property: LayoutAnimation.Properties.opacity,
  },
  update: {
    type: LayoutAnimation.Types.easeInEaseOut,
  },
};

export default class SetStatusInline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: props.token,
      username: props.username,
      selected: undefined,
      message: "test",
      inform: false,
      open: props.open,
      location: undefined
    }
  }
  // Not part of the state, but necessary to view.
  height = 0;
  watchID: ?number = null;

  componentWillMount() {
    this.setState({open: this.props.open});
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.open !== nextProps.open) {
      this.setState({open: nextProps.open});
      console.log("state open: ",this.state.open);
    }
  }

  componentDidReceiveProps() {}

  updateSelectedAvailability(status) {
    this.setState({selected: status});
  }

  submitUpdateAvailability(callback) {
    this.setState({open: !this.state.open});
    console.log(this.state.selected);
    fetch('https://'+server+'/api/users/status/?token='+this.state.token, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          availability: this.state.selected,
          message: this.state.message,
          inform: this.state.inform
          //latitude: this.state.location.coords.latitude,
          //longitude: this.state.location.coords.longitude
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        this.updateLocation();
        // callback(responseJson);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  updateLocation() {

    fetch('https://'+server+'/api/users/location/?token='+this.state.token, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: this.state.username,
          latitude: this.state.location.coords.latitude,
          longitude: this.state.location.coords.longitude,
          height: -1,
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  componentWillUpdate() {
    LayoutAnimation.configureNext(CustomLayoutAnimation);
  }

  componentDidUpdate() {}

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position);
        this.setState({location: position});
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      this.setState({location: position});
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  render() {
    this.height = this.state.open?110:0;
    return (
      <View style={[{height: this.height}, {overflow: 'hidden'}]}>
        <View style={styles.sceneContainer}>

          <View style={styles.availabilityButtons}>
            <TouchableOpacity
              style={[
                (this.state.selected === "Available")?styles.selected:{},
                styles.availButton,
                styles.availButtonTrue
              ]}
              onPress={() => this.updateSelectedAvailability("Available")}
            >
            <Text style={[styles.availButtonText, (this.state.selected === "Available")?styles.availButtonselectedText:{}]}>Available</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                (this.state.selected === "Busy")?styles.selected:{},
                styles.availButton,
                styles.availButtonFalse
              ]}
              onPress={() => this.updateSelectedAvailability("Busy")}
            >
              <Text style={[styles.availButtonText, (this.state.selected === "Busy")?styles.availButtonselectedText:{}]}>Busy</Text>
            </TouchableOpacity>
          </View>

          <Button onPress={() => this.submitUpdateAvailability()} title="Set Status!"/>
        </View>
      </View>
    );
  }
}
