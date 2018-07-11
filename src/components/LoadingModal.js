/**
 * Created by wufei on 2017/11/26.
 * 加载
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {
    StyleSheet,
    View,
    Modal,
    Text,
    ActivityIndicator
} from 'react-native';
import px2dp from '../common/px2dp';
export default class LoadingModal extends Component {

    static propTypes = {
        txtTitle: PropTypes.string.isRequired,
        visible :PropTypes.bool,
        transp:PropTypes.bool,
        onRequestClose :PropTypes.func
    };

    closeModel(){

    }

    render() {
        const {txtTitle,visible,transp} = this.props;
        return (
            <View>
                <Modal
                    visible={visible}
                    transparent={true}
                    animationType='fade'
                    onRequestClose={()=>this.closeModel()}
                >
                    <View
                        style={transp?styles.containerTranspStyle:styles.containerNormStyle}>

                        <View style={transp?styles.textTranspStyle:styles.textNormalStyle}>
                            <ActivityIndicator animating={true} color={transp?'rgba(0,0,0,0)':'white'} size='large'/>
                            <Text style={{fontSize:15,fontWeight:'bold',fontFamily: 'Cochin',color:'white',marginTop:px2dp(20)}}>{txtTitle}</Text>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containerTranspStyle:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'rgba(0, 0, 0, 0)'},
    containerNormStyle:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'rgba(0, 0, 0, 0.7)'},
    textTranspStyle:{height:px2dp(250),
        width:px2dp(350),
        backgroundColor:'rgba(0,0,0,0)',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:px2dp(20)},
    textNormalStyle:{height:px2dp(250),
        width:px2dp(350),
        backgroundColor:'rgba(0,0,0,0.8)',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:px2dp(20)}
});

