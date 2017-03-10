'use-strict'

import React, { Component } from 'react';
import { Image, Text, View } from 'react-native';

const styles = {
  cardContainer: {
    margin: 8,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20
  }
};

export default class Card extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <View style={[styles.cardContainer]}>
      <Image style={styles.profileImage} source={{uri: 'https://avatars3.githubusercontent.com/u/5758214?v=3&s=460'}}/>
    </View>
  }
};
