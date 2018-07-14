import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    Modal,
    TextInput,
    Text,
    ScrollView
} from 'react-native';
// import Modal from 'react-native-modal'
import {Button} from 'teaset';
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


    navBtn(target) {
        this.props.navigation.navigate(target)
    }

    render() {
        return (
            <View style={[theme.root_container, {alignItems: 'center'}]}>
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
                                       placeholder={'请输入'}
                                //keyboardType={'numeric'}
                                       returnKeyType={'done'}
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
                                       placeholder={'请输入'}
                                //keyboardType={'numeric'}
                                       returnKeyType={'done'}
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
                                       placeholder={'请输入'}
                                       keyboardType={'numeric'}
                                       returnKeyType={'done'}
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
                                       placeholder={'请输入'}
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
                    <View style={theme.line_space_10}/>
                    <Button title={'保 存'}
                            style={false ? styles.loginDisableButtonStyle : styles.loginEnableButtonStyle}
                            titleStyle={{fontSize: 18, color: 'white'}}
                        // disabled={props.btnSabled}
                        // onPress={props.onPress}
                    />
                    <View style={theme.line_space_10}/>
                    <View style={styles.footerContent}>
                        <Text style={styles.footerLabel}>所属角色：暂无</Text>
                        <TouchableOpacity onPress={() => this.navBtn(moreMenu.ProfileScreen.menu_supplier_info)}>
                            <Text style={[styles.footerLabel, {color: theme.navColor}]}>申请成为供应商</Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>

                {/*申请成为供应商*/}
                <Modal visible={true} transparent={true}>
                    <View style={styles.modalBackgroundStyle}>
                        <View style={styles.innerContainerTransparentStyle}>
                            <View style={{height:50,justifyContent:'center',alignItems:'center'}}>
                                <Text style={styles.innnerTitle}>申请成为供应商</Text>
                            </View>
                            <View style={{backgroundColor: 'white',alignItems:'center',borderBottomLeftRadius:10,borderBottomRightRadius:10}}>
                                <TextInput style={{
                                    height: 106,
                                    marginTop:12,
                                    width:theme.screenWidth-80,
                                    borderWidth: 1,
                                    borderColor: 'rgba(190,190,190,0.5)',
                                    color: '#333',
                                    textAlignVertical: 'top',
                                    backgroundColor: '#f0eff0'
                                }}
                                           placeholder={'申请成为工程商需要填写申请说明'}
                                           ref="textInput"
                                           placeholderTextColor='#b3b3b3'
                                           multiline={true}
                                           underlineColorAndroid='#f0eff0'
                                           returnKeyType='done'
                                           maxLength={500}
                                />
                                <Text style={styles.innnerSubTitle}> 说明 : 申请成为供应商,警告平台进行审核，通过以后,</Text>
                                <Text style={[styles.innnerSubTitle,{marginTop:2}]}> 你就可以添加工程人员并安卓冷库工程了</Text>

                                <View style={{
                                    marginVertical: 17,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Button title={'取 消'}
                                            titleStyle={{fontSize: 15, color: 'black'}}
                                            style={styles.innderButton}
                                    />
                                    <Button title={'确 定'}
                                            titleStyle={{fontSize: 15, color: 'white'}}
                                            style={[styles.innderButton,{backgroundColor:theme.navColor}]}
                                    />
                                </View>
                            </View>

                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerStyle: {
        height: px2dp(190),
        width: theme.screenWidth,
        backgroundColor: theme.navColor,
        paddingLeft: px2dp(24),
        paddingRight: px2dp(24),
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    row: {
        flex: 1,
        backgroundColor: 'rgb(255,255,255)',
        height: px2dp(100),
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
        height: px2dp(90),
        marginRight: px2dp(20),
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
        fontSize: 16,
        color: 'rgb(51,51,51)'
    },
    loginEnableButtonStyle: {
        height: px2dp(100),
        backgroundColor: theme.themeColor,
        borderColor: 'transparent',
    },
    loginDisableButtonStyle: {
        height: px2dp(100),
        backgroundColor: theme.lightGray,
    },
    footerContent: {
        flexDirection: 'row',
        height: px2dp(70),
        justifyContent: 'space-around',
        alignItems: 'center'
    },

    // modal
    modalBackgroundStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    innerContainerTransparentStyle: {
        backgroundColor: theme.navColor,
        borderRadius: 10,
        width: theme.screenWidth - 50,
    },
    innnerTitle: {
        fontSize: 20,
        color: 'white',
        marginTop: 13
    },
    innnerSubTitle: {
        fontSize: 12,
        color: '#333333',
        marginTop: 13
    },
    innderButton:{
        width: 110,
        height:40,
        marginRight: 20,
        backgroundColor: 'rgb(153,153,153)',
        borderColor: 'transparent',
        borderRadius:20,
    }
});

