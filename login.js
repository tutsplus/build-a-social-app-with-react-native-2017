import React, { Component } from 'react';
import { ActivityIndicator, AsyncStorage, Text, View } from 'react-native';
import { firebaseConnect, pathToJS, isLoaded } from 'react-redux-firebase';
import { NavigationActions } from 'react-navigation';

import { Button, FormLabel, FormInput } from 'react-native-elements';

export default class LoginScreen extends Component {
  state = {
    isLoading: false
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator animating size="large" />
        </View>
      );
    }

    return (
      <View>
        <Text style={{marginTop: 36, textAlign: 'center', fontSize: 18, fontWeight: 'bold'}}>
          Authentication Required
        </Text>

        <FormLabel>Email</FormLabel>
        <FormInput
          textInputRef='emailField'
          ref='email'
          onChangeText={(value) => this.setState({ email: value })}
          autoCapitalize='none'
          autoFocus={true}
          onSubmitEditing={() => this._focusField('password')}
          returnKeyType='next'
          keyboardType='email-address'
        />

        <FormLabel>Password</FormLabel>
        <FormInput
          textInputRef='passwordField'
          ref='password'
          onChangeText={(value) => this.setState({ password: value })}
          onSubmitEditing={() => this._performLogin()}
          returnKeyType='send'
          secureTextEntry={true}
        />

        <Button
          onPress={() => this._performLogin()}
          title="Login"
          style={{marginTop: 25}}
          backgroundColor='#212A34'
        />
      </View>
    );
  }

  _focusField(field) {
    this.refs[field].focus();
  }

  _performLogin() {
    this.setState({ isLoading: true });

    let { email, password } = this.state;
    const credentials = { email, password };

    return this.props.firebase.login(credentials).then(() => {
      AsyncStorage.multiSet([['email', this.state.email], ['password', this.state.password]]).then(() => {
        this.props.navigation.dispatch(NavigationActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'Main' })]
        }));
      });
    }).catch((err) => {
      this.setState({ isLoading: false });
    });
  }
}
