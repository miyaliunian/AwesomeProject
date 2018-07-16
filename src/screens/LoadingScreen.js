/**
 * Created by wufei on 2018/7/10.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import Account from '../store/common/Account'
import DataRepository from '../common/DataRepository'
export default class LoadingScreen extends Component {

    constructor(props) {
        super(props)
        this.dataRepository = new DataRepository();
    }

    componentDidMount() {
        this.dataRepository.fetchLocalRepository('ACCOUNT')
            .then(result => {
                if (result !== '' && result !== null) {
                    this.account = Account;
                    this.account.avatar = result.avatar;
                    this.account.phone = result.phone;
                    this.account.pushId = result.pushId;
                    this.account.nickName = result.nickName;
                    this.account.userName = result.userName;
                    this.account.userRole = result.userRole;
                    this.account.addr = result.addr;
                    this.props.navigation.navigate('App')
                } else { //本机没有账户信息 则跳转到登录
                    this.props.navigation.navigate('Auth')
                }
            })
            .catch(error => {
            })
            .done()
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>欢迎页</Text>
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

