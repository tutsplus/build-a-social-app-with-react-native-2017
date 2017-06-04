import React, { Component } from 'react';
import { ActivityIndicator, AsyncStorage, Text, View } from 'react-native';
import { firebaseConnect, pathToJS, isLoaded } from 'react-redux-firebase';
import { NavigationActions } from 'react-navigation';

import { Button, FormLabel, FormInput } from 'react-native-elements';

@firebaseConnect()
export default class LoginScreen extends Component {
  state = {
    isLoading: false,
    isSignup: false
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator animating size="large" />
        </View>
      );
    }

    let nameField = null;
    if (this.state.isSignup) {
      nameField = (
        <View>
          <FormLabel>Name</FormLabel>
          <FormInput
            onChangeText={(value) => this.setState({ name: value })}
            autoCapitalize='words'
            autoFocus={true}
            onSubmitEditing={() => this._focusField('email')}
            returnKeyType='next'
          />
        </View>
      );
    }

    return (
      <View>
        <Text style={{marginTop: 36, textAlign: 'center', fontSize: 18, fontWeight: 'bold'}}>
          Authentication Required
        </Text>

        {nameField}

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
          onSubmitEditing={() => this._performLoginOrSignup()}
          returnKeyType='send'
          secureTextEntry={true}
        />

        <Button
          onPress={() => this._performLoginOrSignup()}
          title={this.state.isSignup ? "Signup" : "Login"}
          style={{marginTop: 25}}
          backgroundColor='#212A34'
        />

        <Button
          onPress={() => this.setState({ isSignup: !this.state.isSignup })}
          backgroundColor='#79B345'
          style={{marginTop: 8}}
          title={this.state.isSignup ? "Already have an account? Log In." : "Don't have an account? Sign Up."}
        />
      </View>
    );
  }

  _focusField(field) {
    this.refs[field].focus();
  }

  _performLoginOrSignup() {
    if (this.state.isSignup) {
      this._performSignup();
    } else {
      this._performLogin();
    }
  }

  _performSignup() {
    this.setState({ isLoading: true });

    let { email, password, name } = this.state;
    const credentials = { email, password };
    const userData = { displayName: name, email };

    return this.props.firebase.createUser(credentials, userData).then(() => {
      this._saveAndRedirect(credentials);
    }).catch((err) => {
      this.setState({ isLoading: false });
    });
  }

  _performLogin() {
    this.setState({ isLoading: true });

    let { email, password } = this.state;
    const credentials = { email, password };

    return this.props.firebase.login(credentials).then(() => {
      this._saveAndRedirect(credentials);
    }).catch((err) => {
      this.setState({ isLoading: false });
    });
  }

  _saveAndRedirect({ email, password }) {
    AsyncStorage.multiSet([['email', email], ['password', password]]).then(() => {
      this.props.navigation.dispatch(NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Main' })]
      }));
    });
  }
}
