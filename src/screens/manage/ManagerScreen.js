/**
 * 管理页面
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    FlatList,
    ScrollView,
    DeviceEventEmitter,
    TouchableOpacity,
    KeyboardAvoidingView
} from 'react-native';
import theme from '../../common/theme'
import DataRepository from '../../common/DataRepository'
import {Config} from '../../config/config';
import px2dp from '../../common/px2dp'
import Icon from 'react-native-vector-icons/Ionicons'
import MYInput from './MYInput'
import MYAreaInput from './MYAreaInput'
import {Checkbox, Select, Button, Toast} from 'teaset'
import ActionSheet from 'react-native-actionsheet'
import LoadingModal from "../../components/LoadingModal";
import TouchableItem from "react-navigation/src/views/TouchableItem";


const CACHE_RESULTS = {
    current_row: 1,//当前页
    total: 5,//总记录数
    rows: [],//数据集
};


export default class ManagerScreen extends Component {
    static navigationOptions = ({navigation}) => ({
        // header: null
        headerTitle: "添加冷库",
    })

    constructor(props) {
        super(props)
        this.state = {
            isLoginModal: false,
            //冷库名称
            colStorageName: '',//冷库名称
            colStorageVolume: '',//冷库容积
            // 添加冷库
            data: '',//FlatList 数据
            // 冷库划区域
            isYesArea: false,//是
            isNoArea: true,//否
            valueVCustom: 'A',
            valueHCustom: '1',
            isAreaDefaultValue:true,//划分区域默认值
            // 批量添加
            isYesBatch: false, //是
            isBatchValue:'',//批量添加的数量
            isNoBatch: true,//否

        }

        this.dataRepository = new DataRepository();
    }

    componentDidMount() {
        //toast
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
        //1数据集清空
        CACHE_RESULTS.current_row = 1
        CACHE_RESULTS.rows = [{key: '压缩机#1：', index: 0, value: ''}]
        CACHE_RESULTS.total = 5
        //拼接FlatList数据
        this.setState({
            data: CACHE_RESULTS.rows
        })
    }

    //渲染cell
    renderRow(item) {
        return (
            <TouchableItem onPress={() => this.delItem(item)}>
                <View style={styles.cellHeaderStyle}>
                    <MYInput editable={false} title={item.item.key}/>
                    {/*this.setState({ysjV:text})*/}
                    <MYAreaInput title={'工作电压 : '} isCell={true}
                                 onChangeText={(text) => this.setItemText(item.index, text) }/>
                    {item.index == (CACHE_RESULTS.current_row - 1) && item.index != 0
                        ?
                        <Icon name={`ios-close-circle-outline`} size={28} color={'black'} style={styles.cellDelIcon}/>
                        :
                        null
                    }

                </View>
            </TouchableItem>
        )
    }

    //设置textInput内容
    setItemText(cellIndex, text) {
        CACHE_RESULTS.rows.map((item) => {
            if (item.index == cellIndex) {
                item.value = text
            }
        })
    }

    //
    onSubmitEditing() {
        // debugger
        // console.log(this.refs)
        //
        // if (regex.test(this.state.ysjV)) {
        //     alert('真')
        // }else{
        //     alert('假')
        // }

    }

    //点击添加按钮调用此方法
    insertCell() {
        //debugger
        if (CACHE_RESULTS.current_row == 5) {
            DeviceEventEmitter.emit('toastInfo', '压缩机总数不能大于5!', 'fail')
            return
        }
        CACHE_RESULTS.current_row += 1
        //向数组内插入新数据
        for (let i = 0; i <= CACHE_RESULTS.current_row; i++) {
            // 只操作新增的数据，而不修改已经添加的数据
            if (i > this.state.data.length) {
                CACHE_RESULTS.rows.push({key: '压缩机#' + i + '：', index: i - 1, value: ''})
                //更新状态机
                this.setState({
                    data: CACHE_RESULTS.rows
                })
            }
        }
    }

    //点击cell右侧删除图标调用此方法
    delItem(item) {
        if (CACHE_RESULTS.rows.length == 1) {
            DeviceEventEmitter.emit('toastInfo', '压缩机至少保留一个!', 'fail')
            return
        }
        if (item.index != (CACHE_RESULTS.current_row - 1)) {
            return
        }
        CACHE_RESULTS.current_row -= 1
        //根据索引删除数组数据
        CACHE_RESULTS.rows.splice(item.index, 1)
        CACHE_RESULTS.rows.map((item, index) => {
            if (item.index != index) {
                item.key = '压缩机#' + (index + 1)
                item.index = index
            }
        })
        //更新状态机
        this.setState({
            data: CACHE_RESULTS.rows
        })
    }

    showActionSheet() {
        this.ActionSheet.show()
    }

    handlePress(index) {
        if (1 != index) {
            //退出登录:清除本地缓存
            AsyncStorage.clear()
            //清除App注入缓存
            this.removeRepository()
            this.props.navigation.navigate('Auth');
        }
    }

    //保存按钮
    onSubmit() {
        //参数
        let PARAM= new FormData();
        PARAM.signUesrId = 5
        PARAM.freezerName = this.state.colStorageName;

        //冷库容积 ： 保留两位小数
        let regex = /^0\.([1-9]|\d[1-9])$|^[1-9]\d{0,8}\.\d{0,2}$|^[1-9]\d{0,8}$/;
        if (!regex.test(this.state.colStorageVolume)) {
            DeviceEventEmitter.emit('toastInfo', '冷库容积填写格式不正确', 'stop')
            return;
        }
        PARAM.volume =  this.state.colStorageVolume;

        //工作电压 正整数
        let reg = /^[1-9]\d*$/;
        let compressorJson = new Array();
        CACHE_RESULTS.rows.map((item) => {
            let itemObj = {};
            if (item.value != '' && !reg.test(item.value)) {
                throw DeviceEventEmitter.emit('toastInfo', item.key + '的工作电压只能填写正整数', 'stop')

            }

            if (item.value == '') {
                throw DeviceEventEmitter.emit('toastInfo', item.key + '的工作电压不能为空', 'stop')
            }

            itemObj.compressorName = item.key;
            itemObj.voltage = item.value;
            compressorJson.push(itemObj)

        })
        PARAM.compressorJson = compressorJson

        //冷库划区域
        if (this.state.isYesArea){
            PARAM.hasResgion = '1'
            PARAM.regionw = this.state.valueVCustom
            PARAM.regionh = this.state.valueHCustom
        }else {
            PARAM.hasResgion = '0'
        }
        PARAM.isPARAMDefault = this.state.isAreaDefaultValue;

        //批量添加
        if (this.state.isYesBatch){
            PARAM.isBatch = '1'
            PARAM.batchTotal = this.state.isBatchValue
        }else{
            PARAM.isBatch = '0'
        }


        //发送请求
        this.setState({
            isLoginModal: true,
        })
        //发送登录请求
        debugger
        this.dataRepository.postFormRepository(Config.BASE_URL + Config.API_MANAGE_ADD, PARAM)
            .then((data) => {

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

    //渲染方法
    render() {
        return (
                <View style={[theme.root_container, {backgroundColor: '#f2f2f2',}]}>
                    <ScrollView>
                        {/*冷库名称*/}
                        <View style={styles.headerStyle}>
                            <MYInput placeholder='请输入' title={'冷库名称 : '}
                                     onChangeText={(text) => this.setState({colStorageName: text})}/>
                            <MYAreaInput title={'冷库容积 : '}
                                         onChangeText={(text) => this.setState({colStorageVolume: text})}/>
                        </View>


                        {/*添加冷库*/}
                        <View style={{alignItems: 'center', flex: 1}}>
                            <FlatList

                                data={this.state.data}
                                extraData={this.state}
                                renderItem={(item) => this.renderRow(item)}
                            />
                            <Button title={'添加'}
                                    style={styles.insertCellBtnStyle}
                                    titleStyle={{fontSize: 13, color: 'white'}}
                                // disabled={props.btnSabled}
                                    onPress={() => this.insertCell()}
                            />
                        </View>

                        {/*冷库划区*/}
                        <View style={styles.footerStyle}>
                            <View style={{
                                flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start',
                                marginRight: px2dp(30),
                                height: px2dp(100),
                                borderBottomColor: '#d1d1d1',
                                borderBottomWidth: theme.onePixel,
                                marginLeft: px2dp(30),

                            }}>
                                <Text >冷库划区 : </Text>
                                <Checkbox
                                    style={{marginRight: px2dp(20), marginLeft: px2dp(15)}}
                                    title='否'
                                    size='lg'
                                    titleStyle={styles.checkedTxtStyle}
                                    checked={this.state.isNoArea}
                                    onChange={checked => this.setState({isNoArea: checked, isYesArea: !checked})}
                                />
                                <Checkbox
                                    title='是'
                                    size='lg'
                                    titleStyle={styles.checkedTxtStyle}
                                    checked={this.state.isYesArea}
                                    onChange={checked => this.setState({isNoArea: !checked, isYesArea: checked})}
                                />
                            </View>
                            {/*划分区域选择是*/}
                            {this.state.isYesArea ?
                                <View>
                                    <View style={styles.SelectContainStyle}>
                                        <Text>横向 : </Text>
                                        <Select
                                            style={{width: px2dp(200)}}
                                            value={this.state.valueVCustom}
                                            items={['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']}
                                            placeholder='请选择'
                                            pickerTitle='横向选择范围:A~Z'
                                            onSelected={(item, index) => this.setState({valueVCustom: item})}
                                        />
                                    </View>
                                    <View style={styles.SelectContainStyle}>
                                        <Text>纵向 : </Text>
                                        <Select
                                            style={{width: px2dp(200)}}
                                            value={this.state.valueHCustom}
                                            items={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30']}
                                            placeholder='请选择'
                                            pickerTitle='纵向选择范围:1~30'
                                            onSelected={(item, index) => this.setState({valueHCustom: item})}
                                        />
                                    </View>
                                    <Checkbox
                                        style={{marginLeft: px2dp(50), marginBottom: px2dp(40), marginTop: px2dp(30)}}
                                        title='以上参数保存为默认值'
                                        size='lg'
                                        titleStyle={{fontSize: 13, color: theme.navColor}}
                                        checked={this.state.isAreaDefaultValue}
                                        onChange={checked => this.setState({isAreaDefaultValue:checked})}
                                    />
                                </View>
                                :
                                <Checkbox
                                    style={{marginLeft: px2dp(50), marginBottom: px2dp(40), marginTop: px2dp(30)}}
                                    title='以上参数保存为默认值'
                                    size='lg'
                                    titleStyle={{fontSize: 13, color: theme.navColor}}
                                    checked={this.state.isAreaDefaultValue}
                                    onChange={checked => this.setState({isAreaDefaultValue:checked})}
                                />
                            }
                        </View>


                        {/*签发冷库、批量添加*/}
                        <View style={[styles.footer2Style, {height: this.state.isYesBatch ? px2dp(400) : px2dp(200)}]}>
                            <View style={{
                                flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start',
                                marginRight: px2dp(30),
                                height: px2dp(80),
                                marginLeft: px2dp(30),
                                marginTop: px2dp(16),
                                // backgroundColor:'red'
                            }}>
                                <Text >签发冷库 : 张三(17716879324)</Text>
                                <TouchableItem onPress={() => this.showActionSheet()}>
                                    <Text style={{marginLeft: px2dp(20), fontSize: 13, color: theme.navColor}}>更改</Text>
                                </TouchableItem>
                            </View>
                            {/*批量添加*/}
                            <View style={{
                                flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start',
                                marginRight: px2dp(30),
                                height: px2dp(80),
                                marginLeft: px2dp(30),
                                // backgroundColor:'blue',
                                borderBottomColor: '#d1d1d1',
                                borderBottomWidth: theme.onePixel,
                            }}>
                                <Text >批量添加 : </Text>
                                <Checkbox
                                    style={{marginRight: px2dp(20), marginLeft: px2dp(15)}}
                                    title='否'
                                    size='lg'
                                    titleStyle={styles.checkedTxtStyle}
                                    checked={this.state.isNoBatch}
                                    onChange={checked => this.setState({isNoBatch: checked, isYesBatch: !checked})}
                                />
                                <Checkbox
                                    title='是'
                                    size='lg'
                                    titleStyle={styles.checkedTxtStyle}
                                    checked={this.state.isYesBatch}
                                    onChange={checked => this.setState({isNoBatch: !checked, isYesBatch: checked})}
                                />
                            </View>
                            {/*批量添加选择是*/}
                            {this.state.isYesBatch ?
                                <View>
                                    <MYAreaInput title={'添加数量 : '} onChangeText={(text) => this.setState({isBatchValue: text})}/>
                                    <View
                                        style={{flexDirection: 'row', marginLeft: px2dp(94), marginRight: px2dp(120)}}>
                                        <Text >注意 : </Text>
                                        <Text style={{
                                            marginLeft: px2dp(12),
                                            fontSize: 12,
                                            color: '#ff6868',
                                            height: px2dp(120),
                                            flex: 1
                                        }}>冷库的名称将被重新命名成您输入的冷库名称后面再拼接一个编号的形式，如"冷库#1"、"冷库#2"
                                            ...</Text>
                                    </View>
                                </View>
                                :
                                null
                            }

                        </View>


                        {/*设置绑定*/}
                        <View style={styles.footerStyle}>
                            <View style={{
                                flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start',
                                marginRight: px2dp(30),
                                height: px2dp(100),
                                borderBottomColor: '#d1d1d1',
                                borderBottomWidth: theme.onePixel,
                                marginLeft: px2dp(30),

                            }}>
                                <Text >设备绑定 : </Text>
                                <TouchableItem onPress={() => this.showActionSheet() }>
                                    <Text style={{fontSize: 16, color: theme.navColor}}>请选择 </Text>
                                </TouchableItem>
                            </View>
                        </View>


                        {/*确认添加按钮*/}
                        <Button title={'确认添加'}
                                style={styles.loginEnableButtonStyle}
                                titleStyle={{fontSize: 18, color: 'white'}}
                                onPress={() => this.onSubmit() }
                        />
                    </ScrollView>
                    {/*ActionSheet*/}
                    <ActionSheet
                        ref={o => this.ActionSheet = o}
                        options={['搜   索', '扫一扫', '取消']}
                        cancelButtonIndex={2}
                        // onPress={(index) => this.handlePress(index)}
                        onPress={(index) => alert(index)}
                    />
                    <LoadingModal txtTitle={'请稍后...'} visible={this.state.isLoginModal}/>
                </View>

        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        display: 'flex',
        flex: 1,
    },
    headerStyle: {
        justifyContent: 'center',
        width: theme.screenWidth - px2dp(22),
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        marginTop: px2dp(20),
        shadowOffset: {width: 0, height: -1},
        shadowColor: 'black',
        shadowOpacity: 0.2,
        elevation: 1,
    },
    cellHeaderStyle: {
        justifyContent: 'center',
        width: theme.screenWidth - px2dp(22),
        alignItems: 'center',
        backgroundColor: 'rgb(214,233,252)',
        borderRadius: 10,
        marginTop: px2dp(20),
        shadowOffset: {width: 0, height: -1},
        shadowColor: 'black',
        shadowOpacity: 0.2,
        elevation: 1,
    },
    cellDelIcon: {
        position: 'absolute',
        right: px2dp(10),
        top: px2dp(6)
    },
    insertCellBtnStyle: {
        width: px2dp(240),
        height: px2dp(60),
        marginTop: 11,
        backgroundColor: theme.themeColor,
        borderColor: 'transparent',
        borderRadius: 30
    },
    footerStyle: {
        width: theme.screenWidth - px2dp(32),
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        marginTop: px2dp(20),
        shadowOffset: {width: 0, height: 0},
        shadowColor: 'black',
        shadowOpacity: 0.2,
        elevation: 1,
    },
    checkedTxtStyle: {
        fontSize: 14
    },
    SelectContainStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: px2dp(24),
        marginLeft: px2dp(120),
    },
    footer2Style: {
        height: px2dp(400),
        width: theme.screenWidth - px2dp(32),
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        marginTop: px2dp(20),
        shadowOffset: {width: 0, height: 0},
        shadowColor: 'black',
        shadowOpacity: 0.2,
        elevation: 1,
    },
    // 确认添加按钮
    loginEnableButtonStyle: {
        width: theme.screenWidth - px2dp(48),
        height: px2dp(68),
        marginVertical: px2dp(28),
        backgroundColor: theme.navColor,
        borderColor: 'transparent',
        borderRadius: 5
    },
});

