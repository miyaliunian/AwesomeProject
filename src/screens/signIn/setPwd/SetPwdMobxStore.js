import {observable, action, computed, autorun} from 'mobx';

export default class SetPwdMobxStore {
    @observable
    USER_INFO = {
        cell_phone: '',//手机号
        user_password: '',//密码
    };

    @computed get btnState(){
        if (this.USER_INFO.cell_phone!= '' && this.USER_INFO.user_password!= '' ){
            return false;
        }else {
            return true
        }
    }

}


