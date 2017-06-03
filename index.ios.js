import React from 'react';
import { AppRegistry } from 'react-native';
import { StackNavigator, TabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

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

AppRegistry.registerComponent('PictureFeed', () => MainNavigator);
