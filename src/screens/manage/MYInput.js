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
const MYInput = (props) => {


    return(
        <View style={iStyle.inputViewStyle}>
            <Text>{props.title}</Text>
            <TextInput placeholder={props.placeholder}
                   style={iStyle.inputStyle}
                   textAlignVertical={'center'}
                   secureTextEntry={props.secureTextEntry}
                   onChangeText={props.onChangeText}
                   onFocus={props.onFocus}
                   onBlur={props.onBlur}
                   maxLength={props.maxLength}
                   editable={props.editable}
                   autoCapitalize='none'
                   clearButtonMode={'always'}
                   underlineColorAndroid='transparent'
            />

        </View>
    )
};

export default MYInput;

const iStyle = StyleSheet.create({
    inputViewStyle:{
        height:px2dp(70),
        marginTop:px2dp(20),
        marginBottom:px2dp(12),
        marginLeft:px2dp(30),
        marginRight:px2dp(30),
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
        height:px2dp(114),
        flex:1,
        backgroundColor:'transparent',
    },

});