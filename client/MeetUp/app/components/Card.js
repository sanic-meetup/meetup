'use-strict'

import React, { Component } from 'react';
import { Image, Text, View } from 'react-native';

const styles = {
  cardContainer: {
    marginTop: 4,
    marginBottom: 4,
    borderRadius: 8,
    backgroundColor: 'white',
    borderBottomWidth: 4,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: '#e9e9e9',
  },
  contentContainer: {
    padding: 8,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  profileImageContainer: {
    position: 'relative',
    width: 40,
  },
  available: {
    borderColor: 'white',
    borderWidth: 2,
    backgroundColor: 'rgb(76, 217, 100)',
  },
  busy: {
    borderColor: 'white',
    borderWidth: 2,
    backgroundColor: 'rgb(255, 59, 48)',
  },
  profileImageStatus: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 7,
    width: 14,
    height: 14,
    zIndex: 10,
  },
  cardContext: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 8,
  },
  username: {

  },
  locationName: {

  }
};

export default class Card extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <View style={[styles.cardContainer]}>
      <View style={styles.contentContainer}>
        <View style={styles.profileImageContainer}>
          <View style={[styles.profileImageStatus, this.props.available?styles.available:styles.busy]}></View>
          <Image style={styles.profileImage} source={{uri: 'https://avatars3.githubusercontent.com/u/5758214?v=3&s=460'}}/>
        </View>
        <View style={styles.cardContext}>
          <Text style={styles.username}>{this.props.username}</Text>
          <Text style={styles.locationName}>{this.props.locationName}</Text>
        </View>
      </View>
    </View>
  }
};
