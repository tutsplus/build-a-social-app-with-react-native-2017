import React, { Component } from 'react';
import { Button, ScrollView, Image, Text, View } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Geocoder from 'react-native-geocoder';
import { connect } from 'react-redux';
import { firebaseConnect, pathToJS, populatedDataToJS } from 'react-redux-firebase';

const populates = [
  { child: 'user_id', root: 'profiles' }
];

@firebaseConnect([
  { path: '/posts', queryParams: ['orderByChild=created_at', 'limitToLast=5'], populates}
])
@connect(({ firebase }) => ({
  auth: pathToJS(firebase, 'auth'),
  posts: populatedDataToJS(firebase, 'posts', populates)
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
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        Geocoder.geocodePosition({ lat: coords.latitude, lng: coords.longitude }).then((result) => {
          this.props.firebase.push('/posts', {
            user_id: this.props.auth.uid,
            created_at: (new Date()).getTime(),
            image: `data:image/jpeg;base64,${response.data}`,
            location: `${result[0].locality}, ${result[0].country}`
          });
        });
      });
    })
  }

  render() {
    let posts = null;
    if (this.props.posts) {
      posts = Object.values(this.props.posts).sort((a,b) => b.created_at - a.created_at).map((post, i) => {
        let date = new Date(post.created_at);

        return (
          <View key={i} style={{padding: 10, marginBottom: 25, backgroundColor: '#FFF'}}>
            <Text style={{paddingBottom: 5, fontWeight: 'bold'}}>{post.user_id.displayName}</Text>
            <Image source={{uri: post.image, isStatic: true }} style={{height: 250}} />
            <Text style={{paddingTop: 5, textAlign: 'center', fontStyle: 'italic'}}>
              {post.location ? post.location : 'Somewhere in the world'}
            </Text>
          </View>
        )
      });
    }

    return (
      <ScrollView>
        {posts}
      </ScrollView>
    );
  }
}
