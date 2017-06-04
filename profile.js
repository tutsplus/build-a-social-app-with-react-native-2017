import React, { Component } from 'react';
import { Button, Text, StyleSheet } from 'react-native';
import md5 from 'blueimp-md5';
import {Avatar, Grid, Row, Col} from 'react-native-elements';

import { connect } from 'react-redux';
import { firebaseConnect, dataToJS, pathToJS } from 'react-redux-firebase';

const styles = StyleSheet.create({
  statsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    height: 40
  },

  stats: {
    fontWeight: '700'
  }
});

@connect(({ firebase }) => ({
  auth: pathToJS(firebase, 'auth')
}))
@firebaseConnect((props) => ([
  '/posts#orderByChild=user_id&equalTo=' + (props.auth.uid ? props.auth.uid : '')
]))
@connect(({ firebase }, { auth }) => ({
  profile: pathToJS(firebase, 'profile'),
  posts: dataToJS(firebase, 'posts')
}))
export default class ProfileScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Profile',
    headerRight: <Button title="Add Contacts" onPress={() => navigation.navigate('AddContacts')} />
  });

  gravatarUrl() {
    let email = this.props.auth.email;
    return 'https://gravatar.com/avatar/' + md5(email) + '?s=400';
  }

  render() {
    let name = this.props.profile ? this.props.profile.displayName : 'Anonymous';
    let follow = this.props.profile && this.props.profile.following ? this.props.profile.following.length : 0;
    let posts = this.props.posts ? Object.keys(this.props.posts).length : 0;

    return (
      <Grid>
        <Row style={{alignItems: 'center'}}>
          <Avatar
            large
            rounded
            source={{uri: this.gravatarUrl()}}
            containerStyle={{width: 75, height: 75, marginVertical: 10}}
          />
          <Text style={{fontSize: 18, marginBottom: 15}}>{name}</Text>
        </Row>
        <Row>
          <Col style={styles.statsContainer}>
            <Text style={styles.stats}>{follow} Following</Text>
          </Col>
          <Col style={styles.statsContainer}>
            <Text style={styles.stats}>{posts} Posts</Text>
          </Col>
        </Row>
      </Grid>
    );
  }
}
