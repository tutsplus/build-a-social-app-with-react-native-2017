import React, { Component } from 'react';
import { Button, ScrollView } from 'react-native';
import { List, ListItem } from 'react-native-elements';

import Contacts from 'react-native-contacts';

import { connect } from 'react-redux';
import { firebaseConnect, pathToJS } from 'react-redux-firebase';

@firebaseConnect()
@connect(({ firebase }) => ({
  auth: pathToJS(firebase, 'auth'),
  profile: pathToJS(firebase, 'profile')
}))
export default class AddContactsScreen extends Component {
  state = { contacts: [] };

  static navigationOptions = ({ navigation }) => ({
    title: 'Add Contacts',
    headerLeft: <Button title="Done" onPress={() => navigation.goBack() } />
  });

  componentDidMount() {
    Contacts.getAll((err, fetchedContacts) => {
      let contacts = [];
      fetchedContacts.forEach((contact) => {
        if (contact.emailAddresses.length > 0) {
          contacts.push(contact);
        }
      });
      this.setState({ contacts });
    });
  }

  render() {
    return (
      <ScrollView>
        <List>
          {
            this.state.contacts.map((contact, i) => (
              <ListItem
                key={i}
                roundAvatar
                avatar={contact.thumbnailPath ? contact.thumbnailPath : null}
                leftIcon={contact.thumbnailPath ? null : {name: 'account-circle'}}
                title={`${contact.givenName} ${contact.familyName}`}
                subtitle={contact.emailAddresses[0].email}
                button
                onPress={() => this._addContact(contact.emailAddresses[0])}
                hideChevron
              />
            ))
          }
        </List>
      </ScrollView>
    );
  }

  async _addContact({ email }) {
    let ref = this.props.firebase.ref;
    let newContact = await ref('/profiles').orderByChild('email').equalTo(email)
      .limitToFirst(1).once('value');

    if (newContact.val()) {
      let following = this.props.profile.following || [];
      following.push(Object.keys(newContact.val())[0]);
      this.props.firebase.update(`/profiles/${this.props.auth.uid}`, {
        following
      });
    }
  }
}
