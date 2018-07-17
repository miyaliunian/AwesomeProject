import {observable, action, computed, autorun} from 'mobx';

export default class CompInfoMobxStore {
    @observable
    COMP_INFO = {
        avatar:'',// 头像
        name: '',//名称
        addr:'',//地址
    };

    @computed get btnState(){
        if (this.COMP_INFO.name!= '' && this.COMP_INFO.Verify!= ''){
            return false;
        }else {
            return true
        }
    }

}


