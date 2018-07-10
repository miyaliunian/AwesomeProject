/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import RootSceen from './RootSceen'
import {Provider} from 'mobx-react/native'
import stores from './src/store'


export default class App extends Component {
    render() {
        return (
            <Provider {...stores}>
                <RootSceen/>
            </Provider>
        );
    }
}


