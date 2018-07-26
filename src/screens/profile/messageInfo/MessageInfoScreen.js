/**
 * Created by wufei on 2018/7/25.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ActivityIndicator,
    FlatList,
    DeviceEventEmitter
} from 'react-native';
import px2dp from '../../../common/px2dp'
import theme from '../../../common/theme'
import DataRepository from '../../../common/DataRepository'
import ItemCell from './ItemCell'
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
const CACHE_RESULTS = {
    DATA_LIST: [], //数据装载
    NEXT_PAGE: 1, //用于翻页
    TOTAL: 0  //总数据条数
};
export default class MessageInfoScreen extends Component {
    static navigationOptions = ({navigation}) => ({
        headerTitle: "我的消息",
    })

    constructor(props) {
        super(props)
        this.state = {
            tipTabs: [{title:'通知',id:0},{title:'提醒',id:1},{title:'警告',id:2}],
        };
    }


    clean = () => {
        CACHE_RESULTS.DATA_LIST = [];
        CACHE_RESULTS.NEXT_PAGE = 1;
        CACHE_RESULTS.TOTAL = 0
    };

    render() {
        return (
            <View style={styles.container}>
                <ScrollableTabView
                    tabBarUnderlineStyle={{backgroundColor: theme.themeColor, height: theme.onePixel}}
                    tabBarTextStyle={{fontSize: px2dp(32), marginTop: px2dp(20)}}
                    tabBarInactiveTextColor = '#999999'
                    tabBarActiveTextColor = {theme.themeColor}
                    ref="scrollableTabView"
                    onChangeTab={(obj)=>{
                        this.clean();
                    }}
                    renderTabBar={() => <ScrollableTabBar style={{height: 40, borderWidth: 0, elevation: 2}}
                                                          tabStyle={{height: 39}}/>}
                >
                    {this.state.tipTabs.map((reuslt, i, arr)=> {
                        let item = arr[i];
                        return  <TabItems key={i} tabLabel={item.title} tabId={item.id} patientId={this.state.relationship_id} {...this.props}/>
                    })}
                </ScrollableTabView>
            </View>
        );
    }
}


class TabItems extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: '',//数据列表
            isLoadingTail: false//标识数据是否加载中
        };
        this.dataRepository = new DataRepository();
        this.isLoadingMore = false;

    }

    componentDidMount() {
        this.fetchData(1)
    }


    fetchData(PageNumber) {
        debugger
        this.setState({
            isLoadingTail: true//数据正在加载中
        });
        //拼接参数
        let PARAM = new FormData();
        //请求数据个数
        PARAM.page=PageNumber
        PARAM.rows=10;
        //栏目列表对应栏目主键
        PARAM.msgType=this.props.tabId
        //发送请求
        debugger
        this.dataRepository.postFormRepository('http://117.48.208.241:6611/msg/list',PARAM)
            .then((data) => {
                debugger
                if (data.flag == '1') {
                    let ITEMS = CACHE_RESULTS.DATA_LIST.slice();
                    ITEMS = ITEMS.concat(data.data.list);
                    CACHE_RESULTS.DATA_LIST = ITEMS;
                    CACHE_RESULTS.NEXT_PAGE += 1;
                    CACHE_RESULTS.TOTAL = data.data.total;
                    this.setState({
                        data: CACHE_RESULTS.DATA_LIST, //数据列表
                        isLoadingTail: false//数据加载结束
                    });
                    this.isLoadingMore = false;
                }
            })
            .catch((err) => {
                DeviceEventEmitter.emit('toastInfo', err.status, 'sad');
                this.setState({
                    isLoading: false, //数据加载成功后，隐藏菊花
                });
                this.isLoadingMore = false;
            })
            .done()
    }

    hasMore() {
        return CACHE_RESULTS.DATA_LIST.length !== CACHE_RESULTS.TOTAL
    }

    fetchMoreData() {
        if (this.isLoadingMore) {
            return;
        }

        if (!this.hasMore() || this.state.isLoadingTail) {
            return
        }
        this.isLoadingMore = true;
        let NEXTPAGE = CACHE_RESULTS.NEXT_PAGE;
        this.fetchData(NEXTPAGE)
    }

    onClick(target,info) {
        let {relationship,account} = this.props;
        this.props.navigation.navigate(target,{memberCode:account.memberCode,consultationId: info.id,title:info.title,synopsis:info.content,picUrl:info.thumb})
    }

    renderItem(item) {
        return <ItemCell item={item} callback={() => this.onClick('')}/>
    }

    separatorView = () => {
        return <View style={GlobalStyles.line}/>;
    };

    renderFooter() {
        if (!this.hasMore() && CACHE_RESULTS.TOTAL !== 0) {
            return (
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{fontSize: 14}}>~~已经到底啦~~</Text>
                </View>
            )
        }

        if (!this.state.isLoadingTail) {
            return <View/>
        }

        return (
            <View style={{
                flexDirection: 'row',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                marginVertical: px2dp(20)
            }}>
                <ActivityIndicator animating={true} size='small'/>
                <Text style={{fontSize: 14, marginLeft: px2dp(10)}}>数据加载中</Text>
            </View>
        )
    }

    render() {
        return (
            <View style={{flex:1}}>
                <FlatList
                    data={this.state.data}
                    renderItem={(item) => this.renderItem(item)}
                    ItemSeparatorComponent={ this.separatorView }
                    keyExtractor={(item, index) => index}
                    refreshing={this.state.isLoadingTail}
                    onEndReachedThreshold={0.1}
                    onEndReached={() => this.fetchMoreData()}
                    ListFooterComponent={() => this.renderFooter()}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
    }
});

