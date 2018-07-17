/**
 * Created by wufei on 2018/7/10.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Image,
    DeviceEventEmitter
} from 'react-native';

import theme from '../../common/theme'
import {Toast} from 'teaset'
import {MapView,Marker} from 'react-native-amap3d'


export default class HomeScreen extends Component {

    constructor(props) {
        super(props)

        this.state = {
            latitude: '',
            longitude: '',
        }
    }

    componentDidMount() {
        this.subscription = DeviceEventEmitter.addListener('toastInfo', (info, type) => {
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

    render() {
        return (
            <SafeAreaView style={theme.root_container}>
                {/*<MapView*/}
                    {/*style = {styles.absoluteFill}*/}
                    {/*zoomLevel={18}*/}
                    {/*tilt={45}*/}
                    {/*mapType='standard'*/}
                    {/*locationInterval={10000} //定位间隔(ms)，默认 2000*/}
                    {/*distanceFilter={10}     //定位的最小更新距离*/}
                    {/*locationEnabled={true}  //开启定位*/}
                    {/*showslocationbutton={true}*/}
                    {/*showsCompass={true}*/}
                    {/*showsscale={true}*/}
                    {/*showsTraffic={true}*/}
                    {/*region={{*/}
                        {/*latitude: this.state.mLatitude,*/}
                        {/*longitude: this.state.mLongitude,*/}
                        {/*latitudeDelta: 0.1,*/}
                        {/*longitudeDelta: 0.1,*/}
                    {/*}}*/}
                    {/*locationStyle={{}}*/}
                    {/*//onlocation 启动定位显示  regison  中的显示区域*/}
                    {/*onlocation={({nativeEvent}) =>this.setState({*/}
                        {/*mLatitude: nativeEvent.latitude,*/}
                        {/*mLongitude: nativeEvent.longitude,*/}
                    {/*})}*/}

                {/*>*/}
                    {/*<Marker*/}
                        {/*active*/}
                        {/*title='这是一个标注点'*/}
                        {/*color='red'*/}
                        {/*description='Hello world!'*/}
                        {/*coordinate={{*/}
                            {/*latitude: 39.806901,*/}
                            {/*longitude: 116.397972,*/}
                        {/*}}*/}
                    {/*/>*/}
                {/*</MapView>*/}
                <MapView style={StyleSheet.absoluteFill}
                locationEnabled={true}
                         onLocation={(nativeEvent) => this.setState({latitude:nativeEvent.latitude,longitude: nativeEvent.longitude})}
                >
                <Marker
                    active
                    title='这是一个标注点'
                    color='red'
                    description='Hello world!'
                    coordinate={{
                        // latitude: 39.806901,
                        // longitude: 116.397972,
                        latitude:this.state.latitude,
                        longitude:this.state.longitude
                    }}
                />
                </MapView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
    },
    absoluteFill: {
        width: theme.screenWidth,
        height: theme.screenHeight
    }
});

