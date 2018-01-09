/* 
* @Author: Nicot
* @Date:   2018-01-07 14:54:48
* @Last Modified by:   Nicot
* @Last Modified time: 2018-01-07 15:22:56
*/

var schedule = require('node-schedule');
var cache = require('../util/cacheUtil.js');
var io = require('../socketio/io.js');
var greeting = require('../greetings/greetings.js')

exports.start = function() {
    console.log('init greetingJob start');
    greeting.init();
    greeting.run();
    //每30分钟更新一次greeting
    var rule30min = new schedule.RecurrenceRule();
    rule30min.minute = [0, 30];
    var job1 = schedule.scheduleJob(rule30min, function(){
        greeting.run();
    });

    //每5分钟更新一次欢迎语
    var rule5min     = new schedule.RecurrenceRule();  
    var job2 = schedule.scheduleJob(rule5min, function(){
        io.broadcast('welcome', JSON.stringify(greeting.getGreeting()));
    });

    console.log('init greetingJob job end');
};
