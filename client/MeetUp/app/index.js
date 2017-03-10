import React, { Component } from 'react';
import { Actions, ActionConst, Scene, Router } from 'react-native-router-flux';


// Scene's
import Login from './views/Login';
import Home from './views/Home';

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
  render() {
    return <Router>
      <Scene key="root" hideNavBar={true}>
        <Scene key="login" component={Login} title="Login" animationStyle={animationStyle}/>
        <Scene key="home" component={Home} title="Home" type={ActionConst.REPLACE}/>
      </Scene>
    </Router>
  }
}
