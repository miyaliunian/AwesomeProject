/**
 * Created by wufei on 2018/7/12.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';

import theme from '../../../common/theme'
import px2dp from '../../../common/px2dp'

export default class SetPwdScreen extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>忘记密码</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#C6E2FF',
    }
});

