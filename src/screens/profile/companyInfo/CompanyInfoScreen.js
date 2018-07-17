/**
 * Created by wufei on 2018/7/16.
 * 公司信息
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    TextInput,
    DeviceEventEmitter,
    TouchableOpacity
} from 'react-native';
import {Button} from 'teaset';
import theme from '../../../common/theme';
import px2dp from '../../../common/px2dp';
import {Config} from '../../../config/config';
import DataRepository from '../../../common/DataRepository'
import CompInfoMobxStore from './CompInfoMobxStore'
import {inject,observer} from 'mobx-react/native'
import {MapView, Marker} from 'react-native-amap3d'
import ImagePicker from "react-native-image-crop-picker";
import uuid from 'uuid'

@inject('account')
@observer
export default class CompanyInfoScreen extends Component {

    static navigationOptions = ({navigation}) => ({
        headerTitle: '公司信息',
        tabBarVisible:false
    })

    constructor(props) {
        super(props);
        this.state = {
            companyAvatar: '',
            latitude: '',
            longitude: '',
            companyName: '',
            companyAddr: '',
        }
        this.dataRepository = new DataRepository();
        this.mobxStore = new CompInfoMobxStore();
    }

    componentDidMount() {
        let {account} = this.props
        this.setState({
            companyAvatar: account.avatar,
        })
    }

    //上传头像到七牛图床
    uploadAvatar(imageUrl, imageUUID) {
        let PARAM = imageUUID;
        this.dataRepository.getRepository(Config.BASE_URL + Config.API_FETCH_TOKEN + PARAM)
            .then((data) => {
                if (data.flag == '1') {

                    //上传头像到七牛图床
                    let key = data.data.path;//文件名
                    let token = data.data.token;//后台返回的token
                    //创建FormData表单
                    let body = new FormData();
                    body.append('token', token);
                    body.append('key', key);
                    body.append('file', {
                        type: 'image/jpeg',
                        uri: imageUrl,
                        name: key,
                    });
                    //创建请求
                    let xhr = new XMLHttpRequest();
                    xhr.open('POST', Config.API_QI_NIU_UPLOAD)
                    xhr.onload = () => {
                        if (xhr.status !== 200) {
                            DeviceEventEmitter.emit('toastInfo', '请求失败', 'sad');
                            return
                        }

                        if (!xhr.responseText) {
                            DeviceEventEmitter.emit('toastInfo', '请求失败', 'sad');
                            return
                        }

                        let response

                        try {
                            response = JSON.parse(xhr.response)
                        } catch (e) {
                            DeviceEventEmitter.emit('toastInfo', e, 'sad');
                        }

                        if (response && response.key) {
                            this.mobxStore.COMP_INFO.avatar = Config.API_QI_NIU_AVATAR + response.key;
                        }
                    }
                    // 发起请求
                    xhr.send(body)
                } else {
                    DeviceEventEmitter.emit('toastInfo', data.msg, 'sad');
                }
            })
            .catch((err) => {
                DeviceEventEmitter.emit('toastInfo', err.status, 'stop');
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
            this.mobxStore.COMP_INFO.avatar = image.path
            //使用状态机缓存头像
            this.uploadAvatar(image.path, imageUUID)
        })
    }

    onSubmit() {
    }

    render() {
        return (
            <View style={[theme.root_container, {alignItems: 'center'}]}>
                <View style={styles.headerStyle}>
                    <TouchableOpacity onPress={() => this.picPicker()}>
                        {this.mobxStore.COMP_INFO.avatar
                            ?
                            <Image source={{uri: this.state.companyAvatar}}
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
                    </TouchableOpacity>
                </View>
                <MapView
                    style={styles.absoluteFill}
                    mapType='standard'
                    locationEnabled={true}
                    locationInterval={10000}
                    distanceFilter={10}
                    zoomLevel={18}
                    coordinate={{
                        latitude: 39.90980,
                        longitude: 116.37296,
                    }}
                    onLocation={({nativeEvent}) =>
                        console.log(`${nativeEvent.latitude}, ${nativeEvent.longitude}`)}
                />
                <View style={styles.footer}>
                    <View style={[styles.row]}>
                        <View style={styles.rowLabel}>
                            <Text style={styles.fontLabel}>名称</Text>
                        </View>
                        <View style={styles.rowContent}>
                            <TextInput style={[styles.TextInputStyle, styles.fontText]}
                                       ref='nameTextInput'
                                       maxLength={18}
                                       underlineColorAndroid='rgb(255,255,255)'
                                       placeholderTextColor='rgb(196,196,196)'
                                       placeholder={'建议输入6个字左右的公司简称'}
                                       returnKeyType={'done'}
                                       onChangeText={(text) => {
                                           this.mobxStore.COMP_INFO.name = text;
                                       }}
                            />
                        </View>
                    </View>
                    <View style={[styles.row]}>
                        <View style={styles.rowLabel}>
                            <Text style={styles.fontLabel}>地址</Text>
                        </View>
                        <View style={styles.rowContent}>
                            <TextInput style={[styles.TextInputStyle, styles.fontText]}
                                       ref='addrTextInput'
                                       maxLength={18}
                                       underlineColorAndroid='rgb(255,255,255)'
                                       placeholderTextColor='rgb(196,196,196)'
                                       placeholder={'请输入'}
                                       returnKeyType={'done'}
                                       onChangeText={(text) => {
                                           this.mobxStore.COMP_INFO.addr = text;
                                       }}
                            />
                        </View>
                    </View>
                    <Button title={'保 存'}
                            style={ styles.loginEnableButtonStyle}
                            titleStyle={{fontSize: 18, color: 'white'}}
                            onPress={() => this.onSubmit()}
                    />
                </View>
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
    absoluteFill: {
        flex: 1,
        width: theme.screenWidth,
        height: theme.screenHeight - px2dp(),

    },
    footer: {
        position: 'absolute',
        bottom: 84,
        backgroundColor: 'white',
        width: theme.screenWidth - 40,
        padding: 28,
        borderRadius: 10,
    },
    row: {
        flex: 1,
        backgroundColor: 'rgb(255,255,255)',
        height: px2dp(100),
        borderWidth: theme.onePixel,
        borderRadius: 10,
        borderColor: 'black',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 3.5
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
        width: 180,
        paddingTop: 0,
        paddingBottom: 0,
        paddingRight: 7,
        textAlign: 'right'
    },
    loginEnableButtonStyle: {
        height: px2dp(96),
        marginVertical: 14,
        backgroundColor: theme.themeColor,
        borderColor: 'transparent',
    },
});

