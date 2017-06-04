import React, { Component } from 'react';
import { AppRegistry, AsyncStorage } from 'react-native';
import { NavigationActions, StackNavigator, TabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

import { firebaseConnect, pathToJS, isLoaded } from 'react-redux-firebase';
import { connect } from 'react-redux';

import LoginScreen from './login';
import TimelineScreen from './timeline';
import PostDetailScreen from './post-detail';
import ProfileScreen from './profile';

const TimelineNavigator = StackNavigator({
  Timeline: { screen: TimelineScreen },
  Post: { path: 'posts/:post_id', screen: PostDetailScreen }
});
TimelineNavigator.navigationOptions = {
  title: 'Timeline',
  tabBarIcon: ({ tintColor }) => <Icon color={tintColor} name="image" />
};

const ProfileNavigator = StackNavigator({
  Profile: { screen: ProfileScreen }
});
ProfileNavigator.navigationOptions = {
  title: 'Profile',
  tabBarIcon: ({ tintColor }) => <Icon color={tintColor} name="account-box" />
};

const MainNavigator = TabNavigator({
  Home: { screen: TimelineNavigator },
  Profile: { screen: ProfileNavigator }
});

@firebaseConnect()
@connect(({ firebase }) => ({
  auth: pathToJS(firebase, 'auth', undefined)
}))
class Main extends Component {
  state = { authComplete: false };

  async _setupAuthentication() {
    try {
      let credentials = await AsyncStorage.multiGet(['email', 'password']);
      await this.props.firebase.login({
        email: credentials[0][1],
        password: credentials[1][1]
      });

      this.setState({ authComplete: true });
    } catch (err) {
      this.props.navigation.dispatch(NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Login' })]
      }));
    }
  }

  componentDidMount() {
    if (!this.props.auth) {
      this._setupAuthentication();
    } else {
      this.setState({ authComplete: true });
    }
  }

  render() {
    return this.state.authComplete ? (<MainNavigator />) : null;
  }
}

const AppNavigator = StackNavigator({
  Main: { screen: Main },
  Login: { screen: LoginScreen }
}, { headerMode: 'none' });

export default connect()(AppNavigator);
