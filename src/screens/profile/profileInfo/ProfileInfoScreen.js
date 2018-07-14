import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    Modal,
    TextInput,
    Text,
    ScrollView,
    DeviceEventEmitter
} from 'react-native';
// import Modal from 'react-native-modal'
import {Button} from 'teaset';
import theme from '../../../common/theme';
import {Config} from '../../../config/config';
import px2dp from '../../../common/px2dp';
import {moreMenu} from '../../../config/moreMenu';
import LoadingModal from "../../../components/LoadingModal";
import Account from "../../../store/common/Account";
import DataRepository from '../../../common/DataRepository'
import ImpProMobxStore from '../../../components/ImpProMobxStore'
import {inject} from 'mobx-react/native'

@inject('account')
export default class ProfileInfoScreen extends Component<{}> {
    static navigationOptions = ({navigation}) => ({
        headerTitle: "",
    })

    constructor(props) {
        super(props);
        this.state = {
            avatar: '',
            userName: '',
            nickName: '',
            phone: '',
            address: '',
            isShowModal: false,
            isLoginModal: false,
        }
        this.dataRepository = new DataRepository();
        this.mobxStore = new ImpProMobxStore();
    }

    componentDidMount() {
        let {account} = this.props
        debugger
        this.setState({
            avatar: account.avatar,
            userName: account.userName,
            nickName: account.nickName,
            phone: account.phone,
            address: account.address,
        })
    }

    //保存个人信息
    onSave() {
        debugger
        //头像
        if (this.mobxStore.IMP_PRO_INFO.avatar == ''){
            if (this.state.avatar != '') {
                this.mobxStore.IMP_PRO_INFO.avatar = this.state.avatar
            }else{
                DeviceEventEmitter.emit('toastInfo', '头像不能为空!', 'sad');
            }
        }

        // 姓名
        if (this.mobxStore.IMP_PRO_INFO.userName == ''){
            if (this.state.userName != '') {
                this.mobxStore.IMP_PRO_INFO.userName = this.state.userName
            }else{
                DeviceEventEmitter.emit('toastInfo', '姓名不能为空!', 'sad');
            }
        }

        // 昵称
        if (this.mobxStore.IMP_PRO_INFO.nickName == ''){
            if (this.state.nickName != undefined) {
                this.mobxStore.IMP_PRO_INFO.nickName = this.state.nickName
            }
        }

        // 电话
        if (this.mobxStore.IMP_PRO_INFO.phone == ''){
            if (this.state.phone != '') {
                this.mobxStore.IMP_PRO_INFO.phone = this.state.phone
            }else{
                DeviceEventEmitter.emit('toastInfo', '电话不能为空!', 'sad');
            }
        }

        // 地址
        if (this.mobxStore.IMP_PRO_INFO.address == ''){
            if (this.state.address != undefined) {
                this.mobxStore.IMP_PRO_INFO.address = this.state.address
            }else{
                DeviceEventEmitter.emit('toastInfo', '地址不能为空!', 'sad');
            }
        }

        let regex = /^1[34578]\d{9}$/;
        if (!regex.test(this.mobxStore.IMP_PRO_INFO.phone)) {
            DeviceEventEmitter.emit('toastInfo', '手机号格式不正确', 'sad');
            return;
        }

        //弹出Modal
        this.setState({
            isLoginModal: true,
        })

        //拼接登录参数
        let PARAM = new FormData();
        PARAM.append('userName', this.mobxStore.IMP_PRO_INFO.userName)
        PARAM.append('avatar', this.mobxStore.IMP_PRO_INFO.avatar)
        PARAM.append('addr', this.mobxStore.IMP_PRO_INFO.address)
        PARAM.append('phone', this.mobxStore.IMP_PRO_INFO.phone)

        //发送登录请求
        this.dataRepository.postFormRepository(Config.BASE_URL + Config.API_PRO_INFO, PARAM)
            .then((data) => {
                debugger
                if (data.flag == '1') {
                    this.setState({
                        isLoginModal: false,
                    });
                    this.saveAccountInfo(data.data);
                    this.props.navigation.navigate('ImpAuthStack')
                } else {
                    this.setState({
                        isLoginModal: false,
                    });
                    DeviceEventEmitter.emit('signInToastInfo', data.msg, 'sad');
                }
            })
            .catch((err) => {
                this.setState({
                    isLoginModal: false,
                })
                DeviceEventEmitter.emit('signInToastInfo', err.status, 'stop');
            })
            .done()
    }

    //本地缓存策略
    saveAccountInfo(data){
        this.account = Account;
        this.account.avatar = data.avatar;
        this.account.phone = data.phone;
        this.account.address = data.addr;
        this.account.userName = data.userName;
        this.dataRepository.mergeLocalRepository('ACCOUNT', data)
            .then(result => {
                console.log(result)
            })
            .catch(error => {
                console.log(error)
            })
            .done()
    }

    //页面渲染
    render() {
        return (
            <View style={[theme.root_container, {alignItems: 'center'}]}>
                <View style={styles.headerStyle}>
                    {this.state.avatar
                        ?
                        <Image source={{uri: this.state.avatar}}
                               style={{
                                   height: px2dp(160),
                                   width: px2dp(160),
                                   borderRadius: px2dp(80),
                                   marginRight: 10
                               }}/>
                        :
                        <Image source={require('../../../icons/profile/default_portrait.png')}
                               style={{
                                   height: px2dp(160),
                                   width: px2dp(160),
                                   borderRadius: px2dp(80),
                                   marginRight: 10
                               }}/>
                    }

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
                                       returnKeyType={'done'}
                                       onChangeText={(text) => {
                                           this.mobxStore.IMP_PRO_INFO.userName = text;
                                       }}
                                       defaultValue={this.state.userName}
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
                                       returnKeyType={'done'}
                                       onChangeText={(text) => {
                                           this.mobxStore.IMP_PRO_INFO.nickName = text;
                                       }}
                                       defaultValue={this.state.nickName}
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
                                       onChangeText={(text) => {
                                           this.mobxStore.IMP_PRO_INFO.phone = text;
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
                                       onChangeText={(text) => {
                                           this.mobxStore.IMP_PRO_INFO.address = text;
                                       }}
                                       defaultValue={this.state.address}
                            />
                        </View>
                    </View>
                    <View style={theme.line_space_10}/>
                    <Button title={'保 存'}
                            style={ styles.loginEnableButtonStyle}
                            titleStyle={{fontSize: 18, color: 'white'}}
                            onPress={() => this.onSave()}
                    />
                    <View style={theme.line_space_10}/>
                    <View style={styles.footerContent}>
                        <Text style={styles.footerLabel}>所属角色：暂无</Text>
                        <TouchableOpacity onPress={() => this.setState({isShowModal: true})}>
                            <Text style={[styles.footerLabel, {color: theme.navColor}]}>申请成为供应商</Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>

                {/*申请成为供应商*/}
                <Modal
                    visible={this.state.isShowModal}
                    transparent={true}
                    animationType={'fade'}

                >
                    <View style={styles.modalBackgroundStyle}>
                        <View style={styles.innerContainerTransparentStyle}>
                            <View style={{height: 50, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={styles.innnerTitle}>申请成为供应商</Text>
                            </View>
                            <View style={{
                                backgroundColor: 'white',
                                alignItems: 'center',
                                borderBottomLeftRadius: 10,
                                borderBottomRightRadius: 10
                            }}>
                                <TextInput style={{
                                    height: 106,
                                    marginTop: 12,
                                    width: theme.screenWidth - 80,
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
                                <Text style={[styles.innnerSubTitle, {marginTop: 2}]}> 你就可以添加工程人员并安卓冷库工程了</Text>

                                <View style={{
                                    marginVertical: 17,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Button title={'取 消'}
                                            titleStyle={{fontSize: 15, color: 'black'}}
                                            style={styles.innderButton}
                                            onPress={() => this.setState({isShowModal: false})}
                                    />
                                    <Button title={'确 定'}
                                            titleStyle={{fontSize: 15, color: 'white'}}
                                            style={[styles.innderButton, {backgroundColor: theme.navColor}]}
                                            onPress={() => this.setState({isShowModal: false})}
                                    />
                                </View>
                            </View>

                        </View>
                    </View>
                </Modal>
                <LoadingModal txtTitle={'请稍后...'} visible={this.state.isLoginModal}/>
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
        width: 200,
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
        height: px2dp(96),
        backgroundColor: theme.themeColor,
        borderColor: 'transparent',
    },
    loginDisableButtonStyle: {
        height: px2dp(96),
        backgroundColor: theme.lightGray,
        borderColor: 'transparent',
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
    innderButton: {
        width: 110,
        height: 40,
        marginRight: 20,
        backgroundColor: 'rgb(153,153,153)',
        borderColor: 'transparent',
        borderRadius: 20,
    }
});

