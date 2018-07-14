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
import LoginInput from './LoginInput'
import theme from '../../common/theme'
import {isIphoneX} from '../../common/theme'
import px2dp from '../../common/px2dp'
import Account from '../../store/common/Account'
import DataRepository from '../../common/DataRepository'
import LoginMobxStore from './LoginMobxStore'
import LoadingModal from "../../components/LoadingModal";
import {Button, Toast} from 'teaset';
import {observer, inject} from 'mobx-react/native'
import {Config} from '../../config/config';
// RN自带加密包
import MD5 from 'blueimp-md5'
@observer
export default class LoginScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoginModal: false,
        };
        this.dataRepository = new DataRepository();
        this.mobxStore = new LoginMobxStore();
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

    onLoginBtn() {
        //手机号格式验证
        let regex = /^1[34578]\d{9}$/;
        if (!regex.test(this.mobxStore.USER_INFO.cell_phone)) {
            DeviceEventEmitter.emit('signInToastInfo', '手机号格式不正确', 'sad');
            return;
        }
        //弹出Modal
        this.setState({
            isLoginModal: true,
        })
        //拼接登录参数
        let PARAM = new FormData() ;
        PARAM.append('phone',this.mobxStore.USER_INFO.cell_phone)
        PARAM.append('pwd',MD5(this.mobxStore.USER_INFO.user_password))
        //发送登录请求
        this.dataRepository.postFormRepository(Config.BASE_URL + Config.API_LOGIN, PARAM)
            .then((data) => {
                debugger
                if (data.flag == '1') {
                    this.setState({
                        isLoginModal: false,
                    });
                    this.saveAccountInfo(data.data);
                    this.props.navigation.navigate('App')
                }else{
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

    saveAccountInfo(data){
        debugger
        this.account = Account;
        this.account.avatar = data.avatar;
        this.account.phone = data.phone;
        this.account.pushId = data.pushId;
        this.account.userId = data.userId;
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

    onClickText(target) {
        let {navigate} = this.props.navigation;
        navigate(target);
    }

    render() {
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: theme.sBarColor}}>
                <View>
                    <ImageBackground source={require('../../icons/login/bg.png')} style={styles.bg}
                                     resizeMode={'stretch'}>
                        {/*logo*/}
                        <Image source={require('../../icons/login/29拷贝.png')} style={styles.bg_logo}/>
                        <LoginView
                            onPress={() => this.onLoginBtn()}
                            onChangeTopText={(text) => {
                                this.mobxStore.USER_INFO.cell_phone = text;
                            }}
                            onChangeBottomText={(text) => {
                                this.mobxStore.USER_INFO.user_password = text;
                            }}
                            secureTextEntry={true}
                            onSignUpTextPress={() => this.onClickText('SignUp')}
                            onTextPress={() => this.onClickText('setPwd')}
                            btnSabled={this.mobxStore.btnState}
                        />
                        <LoadingModal txtTitle={'正在登录...'} visible={this.state.isLoginModal}/>
                    </ImageBackground>
                </View>

            </SafeAreaView>
        );
    }
}

const LoginView = (props) => {
    return (
        <View style={styles.loginViewStyle}>

            <LoginInput placeholder='手机号'
                        icon={require('../../icons/login/icon_sj.png')}
                        onChangeText={props.onChangeTopText}
            />

            <LoginInput placeholder='密码'
                        icon={require('../../icons/login/icon_mm.png')}
                        onChangeText={props.onChangeBottomText}
                        secureTextEntry={props.secureTextEntry}
            />

            <Button title={'登 录'}
                    style={props.btnSabled ? styles.loginDisableButtonStyle : styles.loginEnableButtonStyle}
                    titleStyle={{fontSize: 18, color: 'white'}}
                    disabled={props.btnSabled}
                    onPress={props.onPress}
            />

            <View style={{
                backgroundColor: 'transparent',
                justifyContent: 'space-around',
                alignItems: 'flex-start',
                flexDirection: 'row',
                marginTop: 13
            }}>
                <TouchableOpacity onPress={props.onSignUpTextPress}>
                    <Text style={styles.forgetPassStyle}>
                        注册账户
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={props.onTextPress}>
                    <Text style={styles.forgetPassStyle}>
                        忘记密码?
                    </Text>
                </TouchableOpacity>
            </View>


            <View style={{
                flexDirection: 'row', width: theme.screenWidth, justifyContent: 'space-around', alignItems: 'center',
                height: px2dp(100), marginTop: px2dp(33)
            }}>
                <View style={[theme.line, {width: px2dp(190)}]}/>
                <Text>第三方平台登录</Text>
                <View style={[theme.line, {width: px2dp(190)}]}/>
            </View>
            <View style={styles.vchart}>
                <Image source={require('../../icons/login/pic_vchat.png')} resizeMode={'center'}
                       style={{marginLeft: px2dp(40), marginRight: px2dp(100)}}/>
                <Text style={{fontSize: 15}}>微信账号登录</Text>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    bg: {
        width: theme.screenWidth,
        height: theme.screenHeight,

        alignItems: 'center',
    },
    bg_logo: {
        width: px2dp(180),
        height: px2dp(180),
        marginTop: isIphoneX() == true ? 57 : 26
    },
    loginViewStyle: {
        flex: 1,
        marginTop: 70,
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
    forgetPassStyle: {
        marginTop: px2dp(28),
        height: px2dp(32),
        color: theme.themeColor,
        fontSize: 14,
    },
    vchart: {
        marginLeft: px2dp(90),
        marginRight: px2dp(90),
        borderRadius: 30,
        height: px2dp(86),
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: theme.onePixel,
        borderColor: 'black',
        marginTop: px2dp(33)
    }
});

