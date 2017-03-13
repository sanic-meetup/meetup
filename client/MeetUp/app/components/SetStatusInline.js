'use-strict'

import React, { Component } from 'react';
import { Button, Text, TouchableOpacity, View, ScrollView, AsyncStorage, Animated } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { colors, server } from '../Constants';


const styles = {
  sceneContainer: {
    backgroundColor: colors.black,
    padding: 10,
    height: 89
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
    color: colors.purple,
  }
};

export default class SetStatusInline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: props.token,
      selected: undefined,
      message: "",
      inform: false,
      location: undefined,
      open: props.open
    }
  }

  updateSelectedAvailability(status) {
    this.setState({selected: status});
  }

  submitUpdateAvailability(callback) {
    this.setState({open: !this.state.open});
    return fetch('http://'+server+'/api/status/?token='+this.state.token, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          availability: this.state.selected,
          message: this.state.message,
          inform: this.state.inform,
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        //callback(responseJson);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  componentWillMount() {
    this.setState({open: this.props.open});
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.open !== nextProps.open) {
      this.setState({open: nextProps.open});
    }
  }

  render() {
    console.log(this.state.open);
    return (
      <View style={[{height: (this.state.open) ?84:0}, {overflow: 'hidden'}]}>
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
