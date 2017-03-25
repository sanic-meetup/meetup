/*jslint esversion:6*/
import React, { Component } from 'react';
import { Image, Text, View, LayoutAnimation } from 'react-native';
import { Actions, ActionConst, Scene, Router } from 'react-native-router-flux';
import { colors } from './Constants';
import Icon from 'react-native-vector-icons/Entypo';

const search = (<Icon name="magnifying-glass" size={30} color={colors.black} />)
const account = (<Icon name="emoji-flirt" size={30} color={colors.black} />)

// Scene's
import Login from './views/Login';
import Followers from './views/Followers';
import Following from './views/Following';

// Tab Scenes
import Home from './views/Home';
import { AccountTab, DiscoverTab } from './tabViews';


// animationStyle provided by : https://github.com/aksonov/react-native-router-flux/issues/1202
export const animationStyle = (props) => {
    const { layout, position, scene } = props;

    const direction = (scene.navigationState && scene.navigationState.direction) ?
        scene.navigationState.direction : 'horizontal';

    const index = scene.index;
    const inputRange = [index - 1, index, index + 1];
    const width = layout.initWidth;
    const height = layout.initHeight;

    const opacity = position.interpolate({
        inputRange,
        //default: outputRange: [1, 1, 0.3],
        outputRange: [1, 1, 0.5],
    });

    const scale = position.interpolate({
        inputRange,
        //default: outputRange: [1, 1, 0.95],
        outputRange: [1, 1, 1],
    });

    let translateX = 0;
    let translateY = 0;

    switch (direction) {
        case 'horizontal':
            translateX = position.interpolate({
                inputRange,
                //default: outputRange: [width, 0, -10],
                outputRange: [width, 0, 0],
            });
            break;
        case 'vertical':
            translateY = position.interpolate({
                inputRange,
                //default: outputRange: [height, 0, -10],
                outputRange: [height, 0, 0],
            });
            break;
    }

    return {
        opacity,
        transform: [
            { scale },
            { translateX },
            { translateY },
        ],
    };
};

/* ... */

export default class App extends React.Component {

  handleTabSelect(tabScene) {
    Actions[tabScene.props.sceneKey]();
  }

  render() {
    return <Router>
      <Scene key="root" hideNavBar type={ActionConst.REPLACE}>
        <Scene key="login" component={Login} title="Login" type={ActionConst.REPLACE}/>

        <Scene key="tabbar" tabBarStyle={{backgroundColor: "#fff"}} tabs={true} type={ActionConst.REPLACE}>
          <Scene key="home" initial={true} icon={HomeIcon} tabBarTitle="Tab #1" hideNavBar >
            <Scene key="home_1" component={Home} title="Tab #1_1"/>
          </Scene>
          <Scene key="discover" icon={TabIcon} component={DiscoverTab} tabBarTitle="Tab #3" hideNavBar icon={TabIcon}/>
          <Scene key="account" icon={TabIcon} tabBarTitle="Tab #3" hideNavBar icon={TabIcon}>
            <Scene key="account_1" component={AccountTab} title="Tab #1_1"/>
          </Scene>
        </Scene>
        
      </Scene>
    </Router>
  }
}

class TabIcon extends React.Component {
  render(){
    return (
      <Text style={{color: this.props.selected ? colors.purple :'black'}}>{this.props.tabBarTitle}</Text>
    );
  }
}

class HomeIcon extends React.Component {
  render(){
    const home = (<Icon name="home" size={30} color={this.props.selected ? colors.purple : colors.black} />)
    return (
      <View>{home}</View>
    );
  }
}
