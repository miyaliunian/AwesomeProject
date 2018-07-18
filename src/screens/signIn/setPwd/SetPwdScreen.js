/**
 * Created by wufei on 2018/7/10.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ImageBackground,
    TouchableOpacity,
    DeviceEventEmitter,
    SafeAreaView,

} from 'react-native';
// import {SafeAreaView} from 'react-navigation';
import SetPwdInput from './SetPwdInput'
import theme from '../../../common/theme'
import {isIphoneX} from '../../../common/theme'
import px2dp from '../../../common/px2dp'
import Account from '../../../store/common/Account'
import DataRepository from '../../../common/DataRepository'
import SetPwdMobxStore from './SetPwdMobxStore'
import LoadingModal from "../../../components/LoadingModal";
import {Button, Toast} from 'teaset';
import {observer, inject} from 'mobx-react/native'
import {Config} from '../../../config/config';
// RN自带加密包
import MD5 from 'blueimp-md5'
@observer
export default class SetPwdScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoginModal: false,

        };
        this.dataRepository = new DataRepository();
        this.mobxStore = new SetPwdMobxStore();
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    //提交
    onSubmitBtn() {
        debugger
        //手机号格式验证
        let regex = /^1[34578]\d{9}$/;
        if (!regex.test(this.mobxStore.USER_INFO.phone)) {
            DeviceEventEmitter.emit('signInToastInfo', '手机号格式不正确', 'sad');
            return;
        }
        //密码与确认密码是否一致
        if (this.mobxStore.USER_INFO.pwd != this.mobxStore.USER_INFO.conPwd) {
            DeviceEventEmitter.emit('signInToastInfo', '两次输入密码不一致!', 'sad');
            return;
        }
        //弹出Modal
        this.setState({
            isLoginModal: true,
        })
        //拼接登录参数
        let PARAM = new FormData();
        PARAM.append('phone', this.mobxStore.USER_INFO.phone)
        PARAM.append('validCode', this.mobxStore.USER_INFO.verify)
        PARAM.append('newPwd', MD5(this.mobxStore.USER_INFO.pwd))

        //发送登录请求
        this.dataRepository.postFormRepository(Config.BASE_URL + Config.API_UPDATE_PWD, PARAM)
            .then((data) => {
                debugger
                if (data.flag == '1') {
                    this.setState({
                        isLoginModal: false,
                    });
                    //缓存用户信息 = 1：头像、2：手机号
                    this.saveAccountInfo(data.data);
                    this.props.navigation.navigate('App')
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
        this.account.pushId = data.pushId;
        this.account.userName = data.userName;
        this.account.userRole = data.userRole;
        this.dataRepository.mergeLocalRepository('ACCOUNT', data)
            .then(result => {
                console.log(result)
            })
            .catch(error => {
                console.log(error)
            })
            .done()
    }

    // 获取验证码
    getVerifyCode() {
        if ('' == this.mobxStore.USER_INFO.phone) {
            DeviceEventEmitter.emit('signInToastInfo', '请填写手机号,再获取验证码', 'sad');
            return;
        }

        //弹出Modal
        this.setState({
            isLoginModal: true,
        })

        let param = this.mobxStore.USER_INFO.phone;
        this.dataRepository.getRepository(Config.BASE_URL + Config.API_VALIDCODE + param)
            .then((data) => {
                if (data.flag == '1') {
                    this.setState({
                        isLoginModal: false,
                    });
                    DeviceEventEmitter.emit('signInToastInfo', data.data, 'smile');
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

    render() {
        return (
            <SafeAreaView style={theme.root_container}>
                <View>
                    <ImageBackground source={require('../../../icons/login/bg.png')} style={styles.bg}
                                     resizeMode={'stretch'}>
                        <Image source={require('../../../icons/login/logo.png')} style={styles.top_logo}/>
                        <LoginView
                            onPress={() => this.onSubmitBtn()}
                            onChanger1Text={(text) => {
                                this.mobxStore.USER_INFO.phone = text;
                            }}
                            getVerifyCode={() => this.getVerifyCode()}
                            onChanger2Text={(text) => {
                                this.mobxStore.USER_INFO.verify = text;
                            }}
                            onChanger3Text={(text) => {
                                this.mobxStore.USER_INFO.pwd = text;
                            }}
                            onChanger4Text={(text) => {
                                this.mobxStore.USER_INFO.conPwd = text;
                            }}
                            secureTextEntry={true}
                            btnSabled={this.mobxStore.btnState}
                        />
                        <LoadingModal txtTitle={'请稍后...'} visible={this.state.isLoginModal}/>
                    </ImageBackground>
                </View>

            </SafeAreaView>
        );
    }
}

const LoginView = (props) => {
    return (
        <View style={styles.loginViewStyle}>

            <SetPwdInput placeholder='请输入手机号'
                        icon={require('../../../icons/login/icon_sj.png')}
                        onChangeText={props.onChanger1Text}
            />


            <SetPwdInput
                isVerify={true}
                placeholder='请输入验证码'
                getVerifyCode={props.getVerifyCode}
                icon={require('../../../icons/signup/icon_yzm.png')}
                onChangeText={props.onChanger2Text}
            />

            <SetPwdInput placeholder='请输入密码'
                        icon={require('../../../icons/login/icon_mm.png')}
                        onChangeText={props.onChanger3Text}
                        secureTextEntry={props.secureTextEntry}
            />

            <SetPwdInput placeholder='请再次输入密码'
                        icon={require('../../../icons/login/icon_mm.png')}
                        onChangeText={props.onChanger4Text}
                        secureTextEntry={props.secureTextEntry}
            />

            <Button title={'修改密码'}
                    style={props.btnSabled ? styles.loginDisableButtonStyle : styles.loginEnableButtonStyle}
                    titleStyle={{fontSize: 18, color: 'white'}}
                    disabled={props.btnSabled}
                    onPress={props.onPress}
            />

        </View>
    )
};


const styles = StyleSheet.create({
    bg: {
        width: theme.screenWidth,
        height: theme.screenHeight,
        alignItems: 'center',
    },
    top_logo: {
        width: px2dp(180),
        height: px2dp(180),
        marginTop: isIphoneX() == true ? 57 : 26
    },
    loginViewStyle: {
        flex: 1,
        width: theme.screenWidth,
        marginTop: 70,
    },
    loginVerfiyDisableButtonStyle: {

        height: px2dp(68),
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: theme.onePixel,
        borderRadius: 30
    },
    loginVerfiyEnableButtonStyle: {

        height: px2dp(86),
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: theme.onePixel,
        borderRadius: 30
    },
    loginEnableButtonStyle: {
        marginLeft: px2dp(90),
        marginRight: px2dp(90),
        height: px2dp(68),
        marginTop: 27,
        backgroundColor: theme.themeColor,
        borderColor: 'transparent',
        borderRadius: 30
    },
    loginDisableButtonStyle: {
        marginLeft: px2dp(90),
        marginRight: px2dp(90),
        height: px2dp(86),
        marginTop: 27,
        backgroundColor: theme.lightGray,
        borderColor: 'transparent',
        borderRadius: 30
    },
});

