/**
 * Created by Rabbit on 2017/11/3.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    PixelRatio,
    TouchableOpacity,
    TextInput
} from 'react-native';

import { Input } from 'teaset';
import px2dp from '../../common/px2dp'
const LoginInput = (props) => {


    return(
        <View style={iStyle.inputViewStyle}>
            <Image source={props.icon}/>
            <TextInput placeholder={props.placeholder}
                   style={iStyle.inputStyle}
                   textAlignVertical={'center'}
                   secureTextEntry={props.secureTextEntry}
                   onChangeText={props.onChangeText}
                   onFocus={props.onFocus}
                   onBlur={props.onBlur}
                   maxLength={props.maxLength}
                   autoCapitalize='none'
                   clearButtonMode={'always'}
                   underlineColorAndroid='transparent'
            />
            {
                props.isVerify ?
                    <TouchableOpacity onPress={props.getVerifyCode}>
                        <View style={iStyle.inputTitleContain}>
                            <Text style={iStyle.inputTitleStyle}>获取验证码</Text>
                        </View>

                    </TouchableOpacity>
                    :null
            }

        </View>
    )
};

export default LoginInput;

const iStyle = StyleSheet.create({
    inputViewStyle:{
        height:px2dp(88),
        marginTop:px2dp(20),
        marginLeft:px2dp(108),
        marginRight:px2dp(108),
        borderBottomColor:'#d1d1d1',
        borderBottomWidth:1/PixelRatio.get(),
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
    },
    inputStyle:{
        marginLeft:px2dp(15),
        borderColor:'transparent',
        borderRadius:0,
        height:px2dp(86),
        flex:1,
        backgroundColor:'transparent',
    },
    inputTitleContain:{
        height:px2dp(40),
        justifyContent:'center',
        alignItems:'center',
    },
    inputTitleStyle:{
        fontSize:12,
        color:'rgb(239,94,82)',
        textDecorationLine:'underline'
    }
});