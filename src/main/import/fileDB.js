import React, {Component} from 'react';
import { Platform, WebView, StyleSheet } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import { sha256, print } from './helpers';

function getDb(){
    const db = SQLite.openDatabase(
        {
            name: 'datas.db',
            location: 'default',
            createFromLocation: '~www/datas.db',
        },
        () => {},
        error => {
            print(error);
        }
    );

    return db;
}

export function dbClose(){
    let db = getDb();
    db.close();
}

export function select(tableName, selField, where, datas){
    // let datas = await select('screenLock','*','rowid=? and access_key=?',[3,'123456in']);
    let result = [];
    let db = getDb();

    if(tableName == undefined || selField == undefined){
        return new Promise(function (resolve, reject) {
            resolve(result);
        });
    }

    let sql = 'select '+selField+' from '+tableName;

    if(where != undefined){
        sql+=' where '+where;
    }

    return new Promise(function (resolve, reject) {
        db.transaction(tx => {
            tx.executeSql(sql, datas, (tx, results) => {
                const rows = results.rows;
                let users = [];

                for (let i = 0; i < rows.length; i++) {
                    users.push({
                        ...rows.item(i),
                    });
                }

                result = users;
                resolve(result);

            });
        });
    });
}

export function insert(tableName, setDatas){
    // await insert('screenLock',{rowid : 6, i : 'input', p : 'password', access_key : 'access_key123'});
    let db = getDb();
    let sql = 'insert into '+tableName;

    let keys = Object.keys(setDatas);
    let values = Object.values(setDatas);

    sql += '(';
    for(var i=0;i<keys.length;i++){
        sql+=keys[i];
        if( (i+1) != keys.length ){
            sql+=',';
        }
    }
    sql += ') values (';

    for(var i=0;i<values.length;i++){
        sql+='?';
        if( (i+1) != values.length ){
            sql+=',';
        }
    }
    sql+=');';

    return new Promise(function (resolve, reject) {
        db.transaction(tx => {
            tx.executeSql(sql, values, (tx, results) => {
                print('insert',results);
                resolve(true);
            });
        }, (err) => {
            print(err);
        });
    });
}

export function update(tableName, setDatas, where, datas){
    // await update('screenLock',{access_key : 'zap'},'rowid=?',[6]);
    let db = getDb();
    let sql = 'update '+tableName+' set ';
    let i = 1;

    let keys=Object.keys(setDatas);
    let values=Object.values(setDatas);

    for(var key in setDatas){
        sql += key+'=?';
        if(i != Object.keys(setDatas).length){
            sql+=',';
        }
        i++;
    }

    if(where != undefined){
        sql+=' where '+where;

        for(i=0;i<datas.length;i++){
            values.push(datas[i]);
        }
    }

    return new Promise(function (resolve, reject) {
        db.transaction(tx => {
            tx.executeSql(sql, values, (tx, results) => {
                print('update',results);
                resolve(true);
            });
        }, (err) => {
            print(err);
        });
    });
}

export function del(tableName, where, datas){
    // await del('screenLock','rowid=?',[6]);
    let db = getDb();
    let sql = 'delete from '+tableName;

    if(where != undefined){
        sql+=' where '+where;
    }

    return new Promise(function (resolve, reject) {
        db.transaction(tx => {
            tx.executeSql(sql, datas, (tx, results) => {
                print('del',results);
                resolve(true);
            });
        }, (err) => {
            print(err);
        });
    });
}
