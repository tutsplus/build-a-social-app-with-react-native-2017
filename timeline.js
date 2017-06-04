import React, { Component } from 'react';
import { Button, Text, View } from 'react-native';
import ImagePicker from 'react-native-image-picker';

import { connect } from 'react-redux';
import { firebaseConnect, pathToJS } from 'react-redux-firebase';

@firebaseConnect()
@connect(({ firebase }) => ({
  auth: pathToJS(firebase, 'auth')
}))
export default class TimelineScreen extends Component {
  static navigationOptions = ({ navigation}) => ({
    title: 'Recent Posts',
    headerRight: <Button title="Add Post" onPress={() => navigation.state.params.showImagePicker()} />
  });

  componentDidMount() {
    this.props.navigation.setParams({ showImagePicker: this._showImagePicker.bind(this) });
  }

  _showImagePicker() {
    ImagePicker.showImagePicker({
      mediaType: 'photo',
      quality: 0.1,
      title: 'Select Image'
    }, (response) => {
      this.props.firebase.push('/posts', {
        user_id: this.props.auth.uid,
        created_at: (new Date()).getTime(),
        image: `data:image/jpeg;base64,${response.data}`
      });
    })
  }

  render() {
    return (
      <View>
        <Text>Timeline</Text>
        <Button
          onPress={() => this.props.navigation.navigate('Post', { post_id: '1' })}
          title="Go To Post 1"
        />

        <Button
          onPress={() => this.props.navigation.navigate('Post', { post_id: '2' })}
          title="Go To Post 2"
        />
      </View>
    );
  }
}
