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
import Account from '../../../store/common/Account'
import MD5 from 'blueimp-md5'
import uuid from 'uuid'

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
        PARAM.append('pwd', MD5(this.mobxStore.USER_INFO.pwd))
        PARAM.append('avatar', this.mobxStore.USER_INFO.avatar)

        //发送登录请求
        this.dataRepository.postFormRepository(Config.BASE_URL + Config.API_SIGN, PARAM)
            .then((data) => {
            debugger
                if (data.flag == '1') {
                    this.setState({
                        isLoginModal: false,
                    });
                    //缓存用户信息 = 1：头像、2：手机号
                    //DeviceEventEmitter.emit('signInToastInfo', '注册成功...', 'smile');
                    this.saveAccountInfo(data.data);
                    this.props.navigation.navigate('ImpAuth')
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

    //上传头像到七牛图床
    uploadAvatar(imageUrl, imageUUID) {
        let PARAM = imageUUID;
        this.dataRepository.getRepository(Config.BASE_URL + Config.API_FETCH_TOKEN + PARAM)
            .then((data) => {
                if (data.flag == '1') {
                    this.setState({
                        isLoginModal: false,
                    });
                    //上传头像到七牛图床
                    let key = data.data.path;//文件名
                    let token = data.data.token;//后台返回的token
                    //创建FormData表单
                    let body = new FormData();
                    body.append('token', token);
                    body.append('key', key);
                    body.append('file', {
                        type:'image/jpeg',
                        uri:imageUrl,
                        name:key,
                    });
                    //创建请求
                    let xhr = new XMLHttpRequest();
                    xhr.open('POST',Config.API_QI_NIU_UPLOAD)
                    xhr.onload = () => {

                        if (xhr.status !== 200){
                            DeviceEventEmitter.emit('signInToastInfo', '请求失败', 'sad');
                            console.log(xhr.responseText)
                            return
                        }

                        if ( !xhr.responseText ){
                            DeviceEventEmitter.emit('signInToastInfo', '请求失败', 'sad');
                            return
                        }

                        let response

                        try {
                            response = JSON.parse(xhr.response)
                        } catch (e) {
                            DeviceEventEmitter.emit('signInToastInfo', e, 'sad');
                        }

                        if (response && response.key){
                            this.mobxStore.USER_INFO.avatar = Config.API_QI_NIU_AVATAR+response.key;
                        }
                    }
                    // 发起请求
                    xhr.send(body)
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
            let imageUUID = uuid.v4() + '.jpeg'
            this.mobxStore.USER_INFO.avatar = image.path
            this.uploadAvatar(image.path, imageUUID)
        })
    }

    render() {
        return (
            <SafeAreaView style={theme.root_container}>
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
                                <Image source={require('../../../icons/signup/avatar.png')} style={styles.avatar}
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
                        secureTextEntry={props.secureTextEntry}
            />

            <LoginInput placeholder='请再次输入密码'
                        icon={require('../../../icons/login/icon_mm.png')}
                        onChangeText={props.onChanger4Text}
                        secureTextEntry={props.secureTextEntry}
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
        borderRadius: px2dp(90),
        marginLeft:1.5,
        marginTop: isIphoneX() == true ? 57 : 26,
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

