/**
 * Created by wufei on 2018/7/10.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Image
} from 'react-native';

import theme from '../../common/theme'

export default class HomeScreen extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <SafeAreaView style={theme.root_container}>
                <Text>首页</Text>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
    }
});

