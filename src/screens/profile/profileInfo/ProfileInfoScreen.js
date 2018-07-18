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
    DeviceEventEmitter,
    TouchableWithoutFeedback
} from 'react-native';
import {Button, Toast} from 'teaset';
import theme from '../../../common/theme';
import {Config} from '../../../config/config';
import px2dp from '../../../common/px2dp';
import {moreMenu} from '../../../config/moreMenu';
import LoadingModal from "../../../components/LoadingModal";
import Account from "../../../store/common/Account";
import ImagePicker from "react-native-image-crop-picker";
import DataRepository from '../../../common/DataRepository'
import ImpProMobxStore from '../../../components/ImpProMobxStore'
import uuid from 'uuid'
import {inject} from 'mobx-react/native'

@inject('account')
export default class ProfileInfoScreen extends Component<{}> {
    static navigationOptions = ({navigation}) => ({
        headerTitle: "个人资料",
    })

    constructor(props) {
        super(props);
        this.state = {
            avatar: '',
            userName: '',
            nickName: '',
            phone: '',
            addr: '',
            isShowModal: false,
            isLoginModal: false,
        }
        this.dataRepository = new DataRepository();
        this.mobxStore = new ImpProMobxStore();
    }

    componentDidMount() {
        let {account} = this.props
        let userRoleName;
        //用户角色解析
        if (account.userRole == '0'){
            userRoleName = '暂无角色';
        }
        if (account.userRole == '1'){
            userRoleName = '工程商';
        }
        if (account.userRole == '2'){
            userRoleName = '工程人员';
        }
        if (account.userRole == '3'){
            userRoleName = '冷库老板';
        }
        if (account.userRole == '4'){
            userRoleName = '冷库员工';
        }
        if (account.userRole == '5'){
            userRoleName = '冷库租客';
        }
        this.setState({
            avatar: account.avatar,
            userName: account.userName,
            nickName: account.nickName,
            phone: account.phone,
            addr: account.addr,
            leftBtnTitle:'取 消',
            userRoleName:userRoleName //对应的为用户权限
        })
    }

    //上传头像到七牛图床
    uploadAvatar(imageUrl, imageUUID) {
        debugger
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
                            this.mobxStore.IMP_PRO_INFO.avatar = Config.API_QI_NIU_AVATAR+response.key;
                            //替换本地图片
                            this.setState({avatar:this.mobxStore.IMP_PRO_INFO.avatar})
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
            this.mobxStore.IMP_PRO_INFO.avatar = image.path
            this.uploadAvatar(image.path, imageUUID)
        })
    }

    //保存个人信息
    onSave() {
        debugger
        //头像
        if (this.mobxStore.IMP_PRO_INFO.avatar == '') {
            if (this.state.avatar != '') {
                this.mobxStore.IMP_PRO_INFO.avatar = this.state.avatar
            } else {
                DeviceEventEmitter.emit('toastInfo', '头像不能为空!', 'sad');
                return
            }
        }

        // 姓名
        if (this.mobxStore.IMP_PRO_INFO.userName == '') {
            if (this.state.userName != '') {
                this.mobxStore.IMP_PRO_INFO.userName = this.state.userName
            } else {
                DeviceEventEmitter.emit('toastInfo', '姓名不能为空!', 'sad');
                return
            }
        }

        // 昵称
        if (this.mobxStore.IMP_PRO_INFO.nickName == '') {
            if (this.state.nickName != undefined) {
                this.mobxStore.IMP_PRO_INFO.nickName = this.state.nickName
            }
        }

        // 电话
        if (this.mobxStore.IMP_PRO_INFO.phone == '') {
            if (this.state.phone != '') {
                this.mobxStore.IMP_PRO_INFO.phone = this.state.phone
            } else {
                DeviceEventEmitter.emit('toastInfo', '电话不能为空!', 'sad');
                return
            }
        }

        // 地址
        if (this.mobxStore.IMP_PRO_INFO.addr == '') {
            if (this.state.addr != undefined) {
                this.mobxStore.IMP_PRO_INFO.addr = this.state.addr
            } else {
                DeviceEventEmitter.emit('toastInfo', '地址不能为空!', 'sad');
                return
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
        PARAM.append('nickName', this.mobxStore.IMP_PRO_INFO.nickName)
        PARAM.append('avatar', this.mobxStore.IMP_PRO_INFO.avatar)
        PARAM.append('addr', this.mobxStore.IMP_PRO_INFO.addr)
        PARAM.append('phone', this.mobxStore.IMP_PRO_INFO.phone)

        //发送登录请求
        this.dataRepository.postFormRepository(Config.BASE_URL + Config.API_PRO_INFO, PARAM)
            .then((data) => {
                debugger
                if (data.flag == '1') {
                    this.setState({
                        isLoginModal: false,
                    });
                    DeviceEventEmitter.emit('toastInfo', '更新成功', 'success');
                    this.saveAccountInfo(data.data);
                } else {
                    this.setState({
                        isLoginModal: false,
                    });
                    DeviceEventEmitter.emit('toastInfo', data.msg, 'sad');
                }
            })
            .catch((err) => {
                this.setState({
                    isLoginModal: false,
                })
                DeviceEventEmitter.emit('toastInfo', err.status, 'stop');
            })
            .done()
    }

    //本地缓存策略
    saveAccountInfo(data) {
        this.account = Account;
        this.account.avatar = data.avatar;
        this.account.phone = data.phone;
        this.account.addr = data.addr;
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

    //申请成为工程商
    subApplyInfo() {
        if (this.mobxStore.IMP_PRO_INFO.applyInfo == '') {
            alert('申请信息不能为空');
            return
        }
        //拼参数
        let PARAM = new FormData();
        PARAM.append('applyInfo', this.mobxStore.IMP_PRO_INFO.applyInfo)
        //发送请求
        this.dataRepository.postFormRepository(Config.BASE_URL + Config.API_SUPPLIER_APPLICATION, PARAM)
            .then((data) => {
            debugger
                if (data.flag == '1') {
                    alert(data.data);
                    this.setState({leftBtnTitle: '关 闭'})
                } else {
                    alert(data.msg);
                }
            })
            .catch((err) => {
                alert(err.status);
            })
            .done()
    }


    //页面渲染
    render() {
        return (
            <View style={[theme.root_container, {alignItems: 'center'}]}>
                <View style={styles.headerStyle}>
                    <TouchableOpacity onPress={() => this.picPicker()}>
                    {this.state.avatar
                        ?
                        <Image source={{uri: this.state.avatar}}
                               style={{
                                   height: px2dp(160),
                                   width: px2dp(160),
                                   borderRadius: px2dp(80),
                               }}/>
                        :
                        <Image source={require('../../../icons/profile/default_portrait.png')}
                               style={{
                                   height: px2dp(160),
                                   width: px2dp(160),
                                   borderRadius: px2dp(80),
                               }}/>
                    }
                    </TouchableOpacity>
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
                                       editable={false}
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
                                           this.mobxStore.IMP_PRO_INFO.addr = text;
                                       }}
                                       defaultValue={this.state.addr}
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
                        <Text style={styles.footerLabel}>所属角色：{this.state.userRoleName}</Text>
                        <TouchableOpacity onPress={() => this.setState({isShowModal: true})}>
                            <Text style={[styles.footerLabel, {color: theme.navColor}]}>申请成为工程商</Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>
                {/*申请成为工程商*/}
                <Modal
                    visible={this.state.isShowModal}
                    transparent={true}
                    animationType={'fade'}
                    onRequestClose={() => {this.mobxStore.IMP_PRO_INFO.applyInfo = ''}}
                    onDismiss = {() => {this.mobxStore.IMP_PRO_INFO.applyInfo = ''}}

                >
                    <View style={styles.modalBackgroundStyle}>

                        <View style={styles.innerContainerTransparentStyle}>
                            <View style={{height: 50, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={styles.innnerTitle}>申请成为工程商</Text>
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
                                    backgroundColor: '#f0eff0',
                                    padding:5
                                }}
                                           placeholder={'申请成为工程商需要填写申请说明:XXXXXX'}
                                           ref="textInput"
                                           placeholderTextColor='#b3b3b3'
                                           multiline={true}
                                           numberOfLines={4}
                                           keyboardType={'default'}
                                           textContentType={'none'}
                                           underlineColorAndroid='#f0eff0'
                                           returnKeyType='done'
                                           maxLength={240}
                                           blurOnSubmit={true}
                                           onChangeText={(text) => {
                                               this.mobxStore.IMP_PRO_INFO.applyInfo = text;
                                           }}
                                           onBlur={ () => {
                                           }}
                                />
                                <Text style={styles.innnerSubTitle}> ✨说明 : 申请成为工程商,经平台进行审核，通过以后,</Text>
                                <Text style={[styles.innnerSubTitle, {marginTop: 2}]}> 您就可以添加工程人员并安装冷库工程了</Text>

                                <View style={{
                                    width:theme.screenWidth - 100,
                                    marginVertical: 17,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-around'
                                }}>
                                    <Button title={this.state.leftBtnTitle}
                                            titleStyle={{fontSize: 15, color: 'black'}}
                                            style={styles.innderButton}
                                            onPress={() => this.setState({isShowModal: false})}
                                    />
                                    <Button title={'确 定'}
                                            titleStyle={{fontSize: 15, color: 'white'}}
                                            style={[styles.innderButton, {backgroundColor: theme.navColor}]}
                                            onPress={() => this.subApplyInfo()}
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
        width:40,
        marginLeft: px2dp(30)
    },
    rowContent: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    TextInputStyle: {
        height: px2dp(90),
        width:theme.screenWidth - 80,
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
        backgroundColor: 'rgb(153,153,153)',
        borderColor: 'transparent',
        borderRadius: 20,
    }
});

