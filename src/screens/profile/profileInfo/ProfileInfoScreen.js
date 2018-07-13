import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Platform,
    TouchableOpacity,
    Image,
    TextInput,
    Text,
    ScrollView
} from 'react-native';

import theme from '../../../common/theme';
import px2dp from '../../../common/px2dp';
import {moreMenu} from '../../../config/moreMenu';
import {inject} from 'mobx-react/native'
@inject('account')
export default class ProfileInfoScreen extends Component<{}> {
    static navigationOptions = ({navigation}) => ({
        headerTitle: "",
    })

    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            userName: ''
        }
    }

    componentDidMount() {
        let {account} = this.props
        this.setState({
            phone: account.phone
        })
        console.log(account)
    }


    itemClick(target) {
        this.props.navigation.navigate(target)
    }

    render() {
        return (
            <View style={theme.root_container}>
                <View style={styles.headerStyle}>
                    <Image source={require('../../../icons/profile/default_portrait.png')}
                           style={{
                               height: px2dp(160),
                               width: px2dp(160),
                               borderRadius: px2dp(80),
                               marginRight: 10
                           }}/>
                </View>
                <View style={theme.line_space_10}/>
                <ScrollView>
                    <View style={[styles.row]}>
                        <View style={styles.rowLabel}>
                            <Text style={styles.fontLabel}>姓名</Text>
                        </View>
                        <View style={styles.rowContent}>
                            <TextInput style={[styles.TextInputStyle, styles.fontText]}
                                       ref='nameTextInput'
                                       maxLength={18}
                                       underlineColorAndroid='rgb(255,255,255)'
                                       placeholderTextColor='rgb(196,196,196)'
                                       //placeholder={'请输入'}
                                       //keyboardType={'numeric'}
                                       returnKeyType={'next'}
                                       onFocus={() => {
                                       }}
                                       onChangeText={(text) => {
                                           this.state.name = text
                                       }}
                                       defaultValue={this.state.name}
                            />
                        </View>
                    </View>
                    <View style={theme.line}/>
                    <View style={[styles.row]}>
                        <View style={styles.rowLabel}>
                            <Text style={styles.fontLabel}>昵称</Text>
                        </View>
                        <View style={styles.rowContent}>
                            <TextInput style={[styles.TextInputStyle, styles.fontText]}
                                       ref='nicknameTextInput'
                                       maxLength={18}
                                       underlineColorAndroid='rgb(255,255,255)'
                                       placeholderTextColor='rgb(196,196,196)'
                                       //placeholder={'请输入'}
                                //keyboardType={'numeric'}
                                       returnKeyType={'next'}
                                       onFocus={() => {
                                       }}
                                       onChangeText={(text) => {
                                           this.state.nickname = text
                                       }}
                                       defaultValue={this.state.nickname}
                            />
                        </View>
                    </View>
                    <View style={theme.line}/>
                    <View style={[styles.row]}>
                        <View style={styles.rowLabel}>
                            <Text style={styles.fontLabel}>电话</Text>
                        </View>
                        <View style={styles.rowContent}>
                            <TextInput style={[styles.TextInputStyle, styles.fontText]}
                                       ref='phoneTextInput'
                                       maxLength={18}
                                       underlineColorAndroid='rgb(255,255,255)'
                                       placeholderTextColor='rgb(196,196,196)'
                                       //placeholder={'请输入'}
                                        keyboardType={'numeric'}
                                       returnKeyType={'next'}
                                       onFocus={() => {
                                       }}
                                       onChangeText={(text) => {
                                           this.state.phone = text
                                       }}
                                       defaultValue={this.state.phone}
                            />
                        </View>
                    </View>
                    <View style={theme.line}/>
                    <View style={[styles.row]}>
                        <View style={styles.rowLabel}>
                            <Text style={styles.fontLabel}>地址</Text>
                        </View>
                        <View style={styles.rowContent}>
                            <TextInput style={[styles.TextInputStyle, styles.fontText]}
                                       ref='addressTextInput'
                                       maxLength={18}
                                       underlineColorAndroid='rgb(255,255,255)'
                                       placeholderTextColor='rgb(196,196,196)'
                                       //placeholder={'请输入'}
                                       returnKeyType={'done'}
                                       onFocus={() => {
                                       }}
                                       onChangeText={(text) => {
                                           this.state.address = text
                                       }}
                                       defaultValue={this.state.address}
                            />
                        </View>
                    </View>
                    <View style={theme.line}/>
                    <View style={theme.line}/>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerStyle: {
        height: px2dp(190),
        width: theme.screenWidth,
        backgroundColor: theme.navColor,
        // backgroundColor: 'red',
        paddingLeft: px2dp(24),
        paddingRight: px2dp(24),
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    row: {
        backgroundColor: 'rgb(255,255,255)',
        height: px2dp(92),
        borderWidth: 0,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'
    },
    rowLabel: {
        width: 100,
        marginLeft: px2dp(30)
    },
    rowContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    TextInputStyle: {
        marginRight: px2dp(82),
        width: 200,
        paddingTop: 0,
        paddingBottom: 0,
        paddingRight: 0,
        textAlign: 'right'
    },
    fontText: {
        fontSize: px2dp(28),
        color: 'rgb(196,196,196)',

    },
    fontLabel: {
        fontSize: px2dp(28),
        color: 'rgb(51,51,51)'
    },
});

