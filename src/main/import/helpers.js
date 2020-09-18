import React, {Component} from 'react';
import { Platform, WebView, StyleSheet, Alert } from 'react-native';
import config from './config';

export function qrBaseUrl(){
    return 'https://chart.googleapis.com/chart?chs=200x200&chld=M|0&cht=qr&chl=';
}

export function configUrl(fileName){
    let url = config.CONFIG_URL;
    if(fileName == undefined || fileName == null){
        return url;
    }
    return url + fileName;
}

export function _callConfig(){
    return new Promise(resolve => {
        fetch(configUrl(config.CONFIG_FILE_NAME))
        .then((response) => response.json())
        .then( json => {
            print('_callConfig then', json);
            // resolve(json);
            resolve({catch : false, error : '', res : json});
        })
        .catch((error) => {
            print('_callConfig catch', error);
            // resolve(config);
            resolve({catch : true, error : error, res : [] });
        });
    });
}

export function apiUrl(sel){
    let url = API_URL;
    if(sel == undefined || sel == null){
        return url;
    }
    return url + sel;
}

export function print(){
    if(config.DEBUG) console.log(...arguments);
}

export function baseStr(){
    return '18E9C60E0A74FAB';
}

export function baseRecovery(){
    return '%0A {ADDRESS} recovery phrases%0A%0A   01.{1STR}%0A   02.{2STR}%0A   03.{3STR}%0A   04.{4STR}%0A   05.{5STR}%0A   06.{6STR}%0A   07.{7STR}%0A   08.{8STR}%0A   09.{9STR}%0A   10.{10STR}%0A   11.{11STR}%0A   12.{12STR}%0A   13.{13STR}%0A   14.{14STR}%0A   15.{15STR}%0A   16.{16STR}%0A   17.{17STR}%0A   18.{18STR}%0A   19.{19STR}%0A   20.{20STR}%0A   21.{21STR}%0A   22.{22STR}%0A   23.{23STR}%0A   24.{24STR}%0A%0A%0A%0A%0A%0A%0A%0A';
}

export function postData(arr){
    var result = '';
    for( var key in arr ) {
        result += key + '=' + arr[key] + '&';
    }
    return result;
}

export function getUrlDatas(current_url, option){
    let url_datas = {};
    let temp;

    temp = current_url.replace('http://'+option+'/','');
    temp = temp.split('&');

    for(var i=0;i<temp.length;i++){
        let sp = temp[i].split('=');
        url_datas[sp[0]] = sp[1];
    }

    return url_datas;
}

export function textToImg(para){
    let baseUrl = 'http://api.img4me.com/?';

    if(para == undefined || para == null){
        para = {
            text : 'Image Testing', // %0A : 엔터
            font : 'arial',
            fcolor : '000000',
            size : '15',
            bcolor : 'FFFFFF',
            type : 'png',
        }
    }

    var result = '';
    for( var key in para ) {
        result += key + '=' + para[key] + '&';
    }

    console.log('textToImg url', baseUrl + result);

    return new Promise(resolve => {
        fetch(baseUrl + result)
        .then(res => res.text())
        .then(res => {
            console.log('textToImg', res);
            resolve({catch : false, error : false, res : res });
        })
        .catch(error => {
            console.error(error);
            resolve({catch : true, error : true, res : '', });
        });
    });
}

export function callApi(url, para){
    return fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(para),
    })
    .then((response) => response.json());
}

export function getApiToken(){
    return 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTE4LjIxOC4yMTkuMjAyOjkwMDEvYXBwL3YxLjAvdG9rZW4iLCJpYXQiOjE1NjY5ODIwMDUsImV4cCI6MTU5ODUxODAwNSwibmJmIjoxNTY2OTgyMDA1LCJqdGkiOiJObVVlSjI1RHBRMDhaNHpwIiwic3ViIjoxNSwicHJ2IjoiYjg3OGU4ZWMzMDcwMWU0MzkyMzkxNjU2ZDUzYTAyYTBjYjIwZTU0ZCIsImFwaV9rZXkiOiJocmxla1o4U0JKamZ5YlUwWVhnVGRGUXNDNUx3UjlESWN0QXp4YTRuT1B1S04ybXBWNiIsImFwaV9zZWNyZXQiOiJnUnZKTm80d2JDY004cUFyenRzaE9YWjZIOVVqS2FpUVZJbVluVzIwNUJlRGtHMXA3eCJ9.V3_fetAV9KjYXLempQ_0Zo1JDfVzL6c_R3LPHrd_QkM';
}

function sha256_base(s){
    var chrsz   = 8;
    var hexcase = 0;

    function safe_add (x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }

    function S (X, n) { return ( X >>> n ) | (X << (32 - n)); }
    function R (X, n) { return ( X >>> n ); }
    function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }
    function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }
    function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }
    function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }
    function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }
    function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }

    function core_sha256 (m, l) {

        var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1,
                        0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
                        0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786,
                        0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
                        0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147,
                        0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
                        0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B,
                        0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
                        0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A,
                        0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
                        0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);

        var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F,0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);

        var W = new Array(64);
        var a, b, c, d, e, f, g, h, i, j;
        var T1, T2;

        m[l >> 5] |= 0x80 << (24 - l % 32);
        m[((l + 64 >> 9) << 4) + 15] = l;

        for ( var i = 0; i<m.length; i+=16 ) {
            a = HASH[0];
            b = HASH[1];
            c = HASH[2];
            d = HASH[3];
            e = HASH[4];
            f = HASH[5];
            g = HASH[6];
            h = HASH[7];

            for ( var j = 0; j<64; j++) {
                if (j < 16) W[j] = m[j + i];
                else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);

                T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
                T2 = safe_add(Sigma0256(a), Maj(a, b, c));

                h = g;
                g = f;
                f = e;
                e = safe_add(d, T1);
                d = c;
                c = b;
                b = a;
                a = safe_add(T1, T2);
            }

            HASH[0] = safe_add(a, HASH[0]);
            HASH[1] = safe_add(b, HASH[1]);
            HASH[2] = safe_add(c, HASH[2]);
            HASH[3] = safe_add(d, HASH[3]);
            HASH[4] = safe_add(e, HASH[4]);
            HASH[5] = safe_add(f, HASH[5]);
            HASH[6] = safe_add(g, HASH[6]);
            HASH[7] = safe_add(h, HASH[7]);
        }
        return HASH;
    }

    function str2binb (str) {
        var bin = Array();
        var mask = (1 << chrsz) - 1;
        for(var i = 0; i < str.length * chrsz; i += chrsz) {
            bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);
        }
        return bin;
    }

    function Utf8Encode(string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    }

    function binb2hex (binarray) {
        var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var str = "";
        for(var i = 0; i < binarray.length * 4; i++) {
            str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
            hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
        }
        return str;
    }

    s = Utf8Encode(s);
    return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
}

export function sha256(s){
    return sha256_base(s);
}

export function pinSetValue(){
    let config = {
        numberOfPins : 6,
        keyVibration : (Platform.OS == "ios")? false : true,
        backGroundColor : '#207BF7',
    }

    return config
}

export function emailLiet(){
    emailArr = new Array(
        'ruu.kr',
        'rael.cc',
        'nwytg.net',
        'nbzmr.com',
        'laoho.com',
        'tmpeml.info',
        'sharklasers.com',
        'guerrillamail.info',
        'grr.la',
        'guerrillamail.biz',
        'disbox.net',
        'tmpmail.org',
        'tmpmail.net',
        'tmails.net',
        'disbox.org',
        'moakt.co',
        'moakt.ws',
        'tmail.ws',
        'bareed.ws',
        'guerrillamail.com',
        'guerrillamail.de',
        'guerrillamail.net',
        'guerrillamail.org',
        'guerrillamailblock.com',
        'mailinator.com',
        'vmani.com',
        'yopmail.com',
        'tempinbox.com',
        'nyrmusic.com',
        'maildrop.cc',
        '20mail.it',
        'filzmail.com',
        'mailnesia.com',
        'maildrop.cc',
        'mt2015.com',
    );
    return emailArr;
}

function leadingZeros(n, digits) {
  var zero = '';
  n = n.toString();

  if (n.length < digits) {
    for (i = 0; i < digits - n.length; i++)
      zero += '0';
  }
  return zero + n;
}

export function getNow() {
  var d = new Date();
  var s =
    leadingZeros(d.getFullYear(), 4) + '-' +
    leadingZeros(d.getMonth() + 1, 2) + '-' +
    leadingZeros(d.getDate(), 2) + ' ' +

    leadingZeros(d.getHours(), 2) + ':' +
    leadingZeros(d.getMinutes(), 2) + ':' +
    leadingZeros(d.getSeconds(), 2);

  return s;
}
export function transDate(date){
    if(date == undefined){
        date = new Date();
    }
    var s =
      leadingZeros(date.getFullYear(), 4) + '-' +
      leadingZeros(date.getMonth() + 1, 2) + '-' +
      leadingZeros(date.getDate(), 2) + ' ';

      return s;
}

export function getTimestamp() {
    return Math.floor(+ new Date() / 1000);
}

export function customAlert(content, title = '') {
    Alert.alert(
        title,
        content,
        [
            {
                text: "OK",
            }
        ],
        {cancelable: false},
    );
}
export function dateAddDel(sDate, nNum, type) {
    var yy = parseInt(sDate.substr(0, 4), 10);
    var mm = parseInt(sDate.substr(5, 2), 10);
    var dd = parseInt(sDate.substr(8), 10);

    if (type == "d") {
        d = new Date(yy, mm - 1, dd + nNum);
    }
    else if (type == "m") {
        d = new Date(yy, mm - 1, dd + (nNum * 31));
    }
    else if (type == "y") {
        d = new Date(yy + nNum, mm - 1, dd);
    }

    yy = d.getFullYear();
    mm = d.getMonth() + 1; mm = (mm < 10) ? '0' + mm : mm;
    dd = d.getDate(); dd = (dd < 10) ? '0' + dd : dd;

    return '' + yy + '-' +  mm  + '-' + dd;
}
export function actionAlert(content, action, title = ''){
    Alert.alert(
        title,
        content,
        [
            {
                text: "OK",
                onPress : action,
            }
        ],
        {cancelable: false},
    );
}

export function actionAlert2(content, action, title = ''){
    Alert.alert(
        title,
        content,
        [
            {
                text: "OK",
                onPress : action,
            },
            { text: "Cancel"}
        ],
        {cancelable: false},
    );
}

export function isExist(filename, arr){
    let ex = ( filename.split('.') )[1];

    var isEx = (arr.indexOf(ex)!== -1);

    return isEx;
}

export function isQub(filename){
    let ex = ( filename.split('.') )[1];
    if(ex == 'qub'){
        return true;
    }
    else{
        return false;
    }
}

export function creTranCode(){
    var result = Math.floor(Math.random() * (999999-100000+1) ) + 100000;
    return result + '' + Math.floor(+ new Date() / 1000);
}

export function tran_check(startdate, enddate){
    if (new Date() >= new Date(startdate.replace(/\s/gi, "")) && new Date() < new Date(enddate.replace(/\s/gi, ""))) {
        return true;
    }
    else{
        return false;
    }
}

export function addComma(num){
    var regexp = /\B(?=(\d{3})+(?!\d))/g;
    return num.toString().replace(regexp, ',');
}

export function yearCheck(startdate, enddate){
    var sdd = startdate;
    var edd = enddate;
    var ar1 = sdd.split('-');
    var ar2 = edd.split('-');
    var da1 = new Date(ar1[0], ar1[1], ar1[2]);
    var da2 = new Date(ar2[0], ar2[1], ar2[2]);
    var dif = da2 - da1;
    var cDay = 24 * 60 * 60 * 1000;// 시 * 분 * 초 * 밀리세컨
    var cMonth = cDay * 30;// 월 만듬
    var cYear = cMonth * 12; // 년 만듬

    var value = parseInt(dif/cYear);

    if(value > 3){
        return true;
    }
    else{
        return false;
    }
}

export function filter_wallet(datas, e_list, option){
    let remove_list = [];
    let remove_list2 = [];
    let temp1 = [];

    /*
    option = {
        keyCheck : true,
        removeHide : true,
        removeAddress : '',
        hideOrder : false,
        config : [],
    }
    */

    if(option.config != undefined){
        for(var i=0;i<option.config.length;i++){
            for(var j=0;j<datas.length;j++){
                if(datas[j].send_auth == undefined){
                    datas[j]['send_auth'] = 0;
                }

                if(option.config[i].address == datas[j].address){
                    datas[j]['send_auth'] = option.config[i].send_auth;
                }
            }
        }
    }

    if(option.keyCheck){
        for(var j=0; j<datas.length; j++){
            datas[j]['create_key'] = false;
        }

        for(var i=0; i<e_list.length; i++){
            for(var j=0; j<datas.length; j++){
                if(e_list[i].address == datas[j].address){
                    datas[j]['create_key'] = true;
                }
            }
        }
    }

    if(option.removeHide){
        for(var i=0;i<datas.length;i++){
            if(datas[i].stat == 9){
                remove_list.push(i);
                // datas.splice(i, 1);
            }
        }

        remove_list.sort(function(a, b) {
            return b - a;
        });

        for(var i=0;i<remove_list.length;i++){
            datas.splice(remove_list[i],1);
        }
    }

    if(option.removeAddress.trim() != 0){
        for(var i=0;i<datas.length;i++){
            if(datas[i].address == option.removeAddress){
                datas.splice(i, 1);
            }
        }
    }

    if(option.hideOrder){
        for(var i=0;i<datas.length;i++){
            if(datas[i].stat == 9){
                remove_list2.push(i);
                temp1.push(datas[i]);
                // datas.splice(i, 1);
            }
        }

        remove_list2.sort(function(a, b) {
            return b - a;
        });

        for(var i=0;i<remove_list2.length;i++){
            datas.splice(remove_list2[i],1);
        }

        for(var i=0;i<temp1.length;i++){
            datas.push(temp1[i]);
        }
    }

    return datas;
}
