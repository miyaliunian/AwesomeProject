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
import theme from '../../common/theme'
const MYAreaInput = (props) => {


    return(
        <View style={iStyle.inputViewStyle}>
            <Text>{props.title}</Text>
            <TextInput placeholder={props.placeholder}
                   style={iStyle.inputStyle}
                   textAlignVertical={'end'}
                   secureTextEntry={props.secureTextEntry}
                   onChangeText={props.onChangeText}
                   onFocus={props.onFocus}
                   onBlur={props.onBlur}
                   maxLength={props.maxLength}
                   autoCapitalize='none'
                   clearButtonMode={'always'}
                   underlineColorAndroid='transparent'
            />
            {props.isCell
                ?
                <Text style={{marginLeft:px2dp(10)}}>V</Text>
                :
                <Text style={{marginLeft:px2dp(10)}}>立方米</Text>}

        </View>
    )
};

export default MYAreaInput;

const iStyle = StyleSheet.create({
    inputViewStyle:{
        height:px2dp(70),
        width:theme.screenWidth - px2dp(70),
        marginTop:px2dp(8),
        marginLeft:px2dp(35),
        marginRight:px2dp(30),
        marginBottom:px2dp(20),
        flexDirection:'row',
        alignItems:'center',
    },
    inputStyle:{
        paddingLeft:px2dp(5),
        width:100,
        marginLeft:px2dp(15),
        borderColor:'transparent',
        borderRadius:2,
        height:px2dp(60),
        borderWidth:theme.onePixel,
        borderColor:'#d1d1d1',
        backgroundColor:'transparent',
    },

});