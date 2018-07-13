/**
 * Created by wufei on 2018/7/10.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Image,
    ImageBackground,
    DeviceEventEmitter,
    SafeAreaView,

} from 'react-native';
import LoginInput from './LoginInput'
import theme from '../../../common/theme'
import {isIphoneX} from '../../../common/theme'
import px2dp from '../../../common/px2dp'
import DataRepository from '../../../common/DataRepository'
import SignUpMobxStore from './SignUpMobxStore'
import LoadingModal from "../../../components/LoadingModal";
import {Button, Toast} from 'teaset';
import {observer} from 'mobx-react/native'
import {Config} from '../../../config/config';
import ImagePicker from "react-native-image-crop-picker";
import MD5 from 'blueimp-md5'
import  uuid from 'uuid'


@observer
export default class SignUpScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoginModal: false,

        };
        this.dataRepository = new DataRepository();
        this.mobxStore = new SignUpMobxStore();
    }

    componentDidMount() {
        this.subscription = DeviceEventEmitter.addListener('signInToastInfo', (info, type) => {
            if (type === 'success') {
                Toast.success(info, 1500, 'center');
                return
            }
            if (type === 'fail') {
                Toast.fail(info, 1500, 'center');
                return
            }
            if (type === 'smile') {
                Toast.smile(info, 1500, 'center');
                return
            }
            if (type === 'sad') {
                Toast.sad(info, 1500, 'center');
                return
            }
            if (type === 'stop') {
                Toast.stop(info, 1500, 'center');
            }
        })
    }


    componentWillUnmount() {
        this.subscription.remove();
    }

    //注册
    onLoginBtn() {
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
        PARAM.append('phone', MD5(this.mobxStore.USER_INFO.phone))
        PARAM.append('phone', MD5(this.mobxStore.USER_INFO.phone))
        //发送登录请求
        this.dataRepository.postFormRepository(Config.BASE_URL + Config.API_LOGIN, PARAM)
            .then((data) => {
                if (data.flag == '1') {
                    this.setState({
                        isLoginModal: false,
                    });
                    DeviceEventEmitter.emit('signInToastInfo', '可以登录', 'smile');
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
                debugger
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

    //
    uploadAvatar(imageUrl, imageUUID) {
        debugger
        let PARAM = imageUUID;
        this.dataRepository.getRepository(Config.BASE_URL + Config.API_FETCH_TOKEN + PARAM)
            .then((data) => {
                if (data.flag == '1') {
                    this.setState({
                        isLoginModal: false,
                    });

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

    //调用相机胶卷
    picPicker() {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: true
        }).then(image => {
            let imageUUID = uuid.v1() + '.jpeg'
            this.mobxStore.USER_INFO.avatar = image.path
            this.uploadAvatar(image.path, imageUUID)
        })
    }

    render() {
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: theme.sBarColor}}>
                <View>
                    <ImageBackground source={require('../../../icons/login/bg.png')} style={styles.bg}
                                     resizeMode={'stretch'}>
                        <TouchableOpacity onPress={() => this.picPicker()}>
                            {this.mobxStore.USER_INFO.avatar
                                ?
                                // 获取头像之后
                                <Image
                                    style={styles.avatar}
                                    source={{uri: this.mobxStore.USER_INFO.avatar}}/>
                                :
                                // 没有头像
                                <Image source={require('../../../icons/signup/头像.png')} style={styles.avatar}
                                       resizeMode={'stretch'}/>

                            }

                        </TouchableOpacity>
                        <LoginView
                            onPress={() => this.onLoginBtn()}
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

            <LoginInput placeholder='请输入手机号'
                        icon={require('../../../icons/login/icon_sj.png')}
                        onChangeText={props.onChanger1Text}
            />


            <LoginInput
                isVerify={true}
                placeholder='请输入验证码'
                getVerifyCode={props.getVerifyCode}
                icon={require('../../../icons/signup/icon_yzm.png')}
                onChangeText={props.onChanger2Text}
            />

            <LoginInput placeholder='请输入密码'
                        icon={require('../../../icons/login/icon_mm.png')}
                        onChangeText={props.onChanger3Text}
            />

            <LoginInput placeholder='请再次输入密码'
                        icon={require('../../../icons/login/icon_mm.png')}
                        onChangeText={props.onChanger4Text}
            />

            <Button title={'注 册'}
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
    avatar: {
        width: px2dp(180),
        height: px2dp(180),
        borderRadius: 50,
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

