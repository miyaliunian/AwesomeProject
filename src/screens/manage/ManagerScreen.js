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
} from 'react-native';
import theme from '../../common/theme'
import px2dp from '../../common/px2dp'
import Icon from 'react-native-vector-icons/Ionicons'
import MYInput from './MYInput'
import MYAreaInput from './MYAreaInput'
import {Checkbox, Select, Button, Toast} from 'teaset'
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
            valueVCustom: 'A',
            valueHCustom: '1',
            data: '',//FlatList 数据
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
        //1数据集清空
        CACHE_RESULTS.current_row = 1
        CACHE_RESULTS.rows = [{key: '压缩机#1：'}]
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
                    <MYAreaInput title={'工作电压 : '} isCell={true}/>
                    <Icon name={`ios-close-circle-outline`} size={28} color={'black'} style={styles.cellDelIcon}/>
                </View>
            </TouchableItem>
        )
    }

    //点击添加按钮调用此方法
    insertCell() {
        if (CACHE_RESULTS.current_row == 5) {
            DeviceEventEmitter.emit('toastInfo', '压缩机总数不能大于5!', 'fail')
            return
        }
        CACHE_RESULTS.current_row += 1
        //向数组内插入新数据
        for (let i = 0; i <= CACHE_RESULTS.current_row; i++) {
            // 只操作新增的数据，而不修改已经添加的数据
            if (i > this.state.data.length) {
                CACHE_RESULTS.rows.push({key: '压缩机#' + i + '：'})
                //更新状态机
                this.setState({
                    data: CACHE_RESULTS.rows
                })
            }
        }
    }

    //点击cell右侧删除图标调用此方法
    delItem(item){
        if (CACHE_RESULTS.rows.length == 1){
            DeviceEventEmitter.emit('toastInfo', '压缩机至少保留一个!', 'fail')
            return
        }
        CACHE_RESULTS.current_row -= 1
        //根据索引删除数组数据
        CACHE_RESULTS.rows.splice(item.index,1)
        //更新状态机
        this.setState({
            data: CACHE_RESULTS.rows
        })
    }

    //渲染方法
    render() {
        return (
            <View style={[theme.root_container, {backgroundColor: '#f2f2f2',}]}>
                <ScrollView>
                    {/*冷库名称*/}
                    <View style={styles.headerStyle}>
                        <MYInput placeholder='请输入' title={'冷库名称 : '}/>
                        <MYAreaInput title={'冷库容积 : '}/>

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
                                checked={false}
                                // onChange={checked => alert(checked)}
                            />
                            <Checkbox
                                title='是'
                                size='lg'
                                titleStyle={styles.checkedTxtStyle}
                                checked={false}
                                // onChange={checked => alert(checked)}
                            />
                        </View>
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
                            checked={false}
                            // onChange={checked => alert(checked)}
                        />
                    </View>
                    {/*签发冷库*/}
                    <View style={styles.footer2Style}>
                        <View style={{
                            flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start',
                            marginRight: px2dp(30),
                            height: px2dp(80),
                            marginLeft: px2dp(30),

                        }}>
                            <Text >签发冷库 : 张三(17716879324)</Text>
                            <TouchableItem>
                                <Text style={{marginLeft: px2dp(20), fontSize: 13, color: theme.navColor}}>更改</Text>
                            </TouchableItem>
                        </View>
                        <View style={{
                            flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start',
                            marginRight: px2dp(30),
                            height: px2dp(80),
                            marginLeft: px2dp(30),
                            // backgroundColor:'blue'
                        }}>
                            <Text >批量添加 : </Text>
                            <Checkbox
                                style={{marginRight: px2dp(20), marginLeft: px2dp(15)}}
                                title='否'
                                size='lg'
                                titleStyle={styles.checkedTxtStyle}
                                checked={false}
                                // onChange={checked => alert(checked)}
                            />
                            <Checkbox
                                title='是'
                                size='lg'
                                titleStyle={styles.checkedTxtStyle}
                                checked={false}
                                // onChange={checked => alert(checked)}
                            />
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
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
        height: px2dp(160),
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
});

