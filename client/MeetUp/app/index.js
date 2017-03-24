/*jslint esversion:6*/
import React, { Component } from 'react';
import { Image, Text, View, LayoutAnimation } from 'react-native';
import { Actions, ActionConst, Scene, Router } from 'react-native-router-flux';
import { colors } from './Constants';

// Scene's
import Login from './views/Login';
import Home from './views/Home';
import Followers from './views/Followers';

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
        <Scene key="home" component={Home} title="MeetUp" type={ActionConst.REPLACE}/>
        {/*}<Scene key="tabs" hideNavBar tabs={true} tabBarStyle={{backgroundColor: colors.white}} onSelect={(tabScene) => {this.handleTabSelect(tabScene)}} type={ActionConst.REPLACE}>
          <Scene key="tab1" component={Home} hideNavBar title="MeetUp" icon={TabIcon} tabBarTitle="Status"/>
        </Scene>*/}
        <Scene key="followers" component={Followers} title="Followers" animationStyle={animationStyle}/>
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
