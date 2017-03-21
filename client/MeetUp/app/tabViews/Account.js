import React, {Component} from 'react';
import { View, Text } from 'react-native';

export default class AccountTab extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Text>Account Tab</Text>
      </View>
    );
  }
}
