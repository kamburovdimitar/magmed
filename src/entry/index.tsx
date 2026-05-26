import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';

import App from '../App';
import { store } from '../store/store';

function ReduxApp() {
    return (
        <Provider store={store} >
            <App />
        </Provider>
    );
}

AppRegistry.registerComponent('RNVApp', () => ReduxApp);