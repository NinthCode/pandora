/* 
* @Author: Nicot
* @Date:   2018-01-03 00:24:36
* @Last Modified by:   Nicot
* @Last Modified time: 2018-01-07 15:41:33
*/

var vm = require('vm');
var cache = require('../util/cacheUtil.js');
var rule = require('./rule.js');
var random = require('../util/randomUtil.js');
var config = require('../config/config.js');
var request = require('request');

exports.init = function() {
    for(var ruleType in rule) {
        if(ruleType != 'random') {
            rule[ruleType] = rule[ruleType].sort(compare());
            for(var i in rule[ruleType]){
                rule[ruleType][i]['script'] = new vm.Script(rule[ruleType][i].expression);
            }
        }
    }
    cache.set('rule', rule);
    createGreeting();
    updateContext();
};

exports.run = function() {
    updateDate();
    updateWeather();
}

exports.getGreeting = function(type) {
    if(cache.get('context') == undefined) {
        return {type: type, msg: "很高兴见到你！"};
    }
    if(type == undefined) {
        type = rule.random[random.getRandom(0, rule.random.length)];
    }
    var compileRule = cache.get('rule', rule);
    if(compileRule[type] == undefined) {
        return {type: type, msg: "好像出了点问题哦~"};
    }
    try {
        var result = [];
        var context = cache.get('context');
        var ruleType = compileRule[type];
        for(var i in ruleType){
            result.push(ruleType[i]['script'].runInContext(context));
        }
        for(var i in result) {
            if(result[i]){
                var msg = ruleType[i].characters[random.getRandom(0,  ruleType[i].characters.length)];
                return {type: type, msg: msg};
            }
        }
    } catch(e){
        console('生成Greeting报错，' + e);
        return {type: type, msg: "好像出了点问题哦~"};
    }
};

function createGreeting() {
    var date = new Date();
    var greeting = {
        weather: {
            temp: 0,
            wind: 0,
            weather: 0,
            aqi: 0
        },
        date: {
            y: date.getYear(),
            m: date.getMonth() + 1,
            d: date.getDate(),
            w: date.getDay()
        },
        festival: ''
    };
    cache.set('greeting', greeting);
    return greeting;
}

function updateDate() {
    var date = new Date();
    cache.get('greeting').date.y = date.getYear();
    cache.get('greeting').date.m = date.getMonth() + 1;
    cache.get('greeting').date.d = date.getDate();
    cache.get('greeting').date.w = date.getDay();
    updateContext();
}

function updateWeather() {
    try {
        var nowWeatherUrl = config.weatherUrl['now'] + 'location=' + config.city + '&key=' +config.weatherKey;
        var nowAirUrl = config.weatherUrl['airNow'] + 'location=' + config.city + '&key=' +config.weatherKey;
        request(nowWeatherUrl, function(error, response, body) {
            if(response && response.statusCode == 200) {
                //处理数据
                var bodyJSON = JSON.parse(body);
                if(bodyJSON.HeWeather6[0].status == 'ok') {
                    var data = bodyJSON.HeWeather6[0];
                    cache.get('greeting').weather.temp = parseInt(data.now.tmp);
                    cache.get('greeting').weather.wind = parseInt(data.now.wind_spd);
                    cache.get('greeting').weather.weather = parseInt(data.now.cond_code);
                    updateContext();
                } else {
                    console.log('更新greeting weather信息失败！');
                }
            }
        });

        request(nowAirUrl, function(error, response, body) {
            if(response && response.statusCode == 200) {
                //处理数据
                var bodyJSON = JSON.parse(body);
                if(bodyJSON.HeWeather6[0].status == 'ok') {
                    var data = bodyJSON.HeWeather6[0];
                    cache.get('greeting').weather.aqi = parseInt(data.air_now_city.aqi);
                    updateContext();
                } else {
                    console.log('更新greeting weather信息失败！');
                }
            } else {
                console.log('更新greeting weather信息失败！');
            }
        });
    } catch(e) {
        console.log('更新greeting weather信息失败！' + e);
    }
}

function updateContext() {
    cache.set('context', vm.createContext(cache.get('greeting')));
}


function compare() {
    return function(a, b){
        var value1 = a['level'];
        var value2 = b['level'];
        return value2 - value1;
    }
}

