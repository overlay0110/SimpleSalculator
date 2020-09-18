import { StyleSheet, Platform } from "react-native"
import LocalizedStrings from 'react-native-localization';
import DeviceInfo from 'react-native-device-info';
import en from './en';
import ko from './ko';
import ja from './ja';
import zh from './zh';

let strings = new LocalizedStrings({
    en: en,
    ko: ko,
    ja: ja,
    zh: zh
});

// ios 11 이후 버전부터 LocalizedStrings안먹는 문제 때문에
// 디바이스에 언어정보 불러와서 수동으로 언어 설정
if(Platform.OS === "ios"){
    currentLanguage = DeviceInfo.getDeviceLocale();
    strings.setLanguage(currentLanguage.substr(0,2));
}

strings.setLanguage('ko');

export default strings;
