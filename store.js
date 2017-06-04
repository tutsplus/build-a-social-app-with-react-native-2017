import { createStore, compose } from 'redux';
import { reactReduxFirebase } from 'react-redux-firebase';
import { AsyncStorage } from 'react-native';

import AppReducer from './app-reducer';

const FirebaseConfig = {
  authDomain: 'picture-feed.firebaseapp.com',
  databaseURL: 'https://picture-feed.firebaseio.com/',
  apiKey: 'AIzaSyABtly_uORPn2uOqvH1t_1ZH302yTMFsrI'
}

export default function configureStore(initialState, history) {
  const reduxFirebase = reactReduxFirebase(FirebaseConfig, {
    userProfile: 'profiles',
    enableLogging: true,
    ReactNative: { AsyncStorage }
  });

  const createStoreWithMiddleware = compose(
    reduxFirebase,
    typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension : (f) => f
  )(createStore);
  const store = createStoreWithMiddleware(AppReducer);

  if (module.hot) {
    module.hot.accept('./app-reducer', () => {
      const nextAppReducer = require('./app-reducer');
      store.replaceReducer(nextAppReducer);
    });
  }

  return store;
}
