/* 
* @Author: Nicot
* @Date:   2018-01-03 00:24:36
* @Last Modified by:   Nicot
* @Last Modified time: 2018-01-04 20:37:05
*/

var vm = require('vm');
var cache = require('../util/cacheUtil.js');
var rule = require('./rule.js');
var random = require('../util/randomUtil.js');

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
};

exports.getGreeting = function(type) {
    if(type == undefined) {
        type = rule.random[random.getRandom(0, rule.random.length)];
    }
    var compileRule = cache.get('rule', rule);
    if(compileRule[type] == undefined) {
        return "好像出了点问题哦~";
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
                return ruleType[i].characters[random.getRandom(0,  ruleType[i].characters.length)];
            }
        }
    } catch(e){
        console('生成Greeting报错，' + e);
        return "好像出了点问题哦~";
    }
};

function createGreeting() {
    var date = new Date();
    var greeting = {
        weather: {
            temp: 0,
            wind: 0,
            weather: 0
        },
        date: {
            y: date.getYear(),
            m: date.getMonth() + 1,
            d: date.getDate(),
            w: date.getDay()
        },
        festival: '元旦'
    };
    cache.set('greeting', greeting);
    return greeting;
}
exports.updateContext = function() {
    cache.set('context', vm.createContext(cache.get('greeting')));
}


function compare() {
    return function(a, b){
        var value1 = a['level'];
        var value2 = b['level'];
        return value2 - value1;
    }
}

