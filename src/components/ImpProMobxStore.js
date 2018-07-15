import {observable, computed} from 'mobx';

export default class ImpProMobxStore {
    @observable
    IMP_PRO_INFO = {
        avatar:'',// 头像
        userName: '',//姓名
        nickName:'',//昵称
        phone: '',//电话
        addr:'',//地址,
        applyInfo:'',// 申请理由
    };


    @computed get btnState(){
        debugger
        if ( this.IMP_PRO_INFO.userName == ''&& this.IMP_PRO_INFO.phone == '' && this.IMP_PRO_INFO.addr == '' ){
            return true;
        }else {
            return false
        }
    }

}


