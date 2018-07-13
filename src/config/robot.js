'use strict'
import qiniu from 'qiniu'
import config from './config'

qiniu.conf.ACCESS_KEY = config.qi_niu.AK;
qiniu.conf.SECRET_KEY = config.qi_niu.SK;

//上传空间
let bucket = config.bucket;

//上传到七牛后保存的文件名
let key = 'avatar';

function uptoken(bucket, key) {
    let putPolicy = new qiniu.rs.PutPolicy(bucket + ':' + key)
    //域名
    putPolicy.callbackUrl = '' ;
    //信息
    putPolicy.callbackBody = '' ;
    return putPolicy.token();
}

export function getQiNiuToken () {
    var token =uptoken(bucket,key)
    return token;
}