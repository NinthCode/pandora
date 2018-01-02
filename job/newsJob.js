/* 
* @Author: Nicot
* @Date:   2018-01-01 10:27:40
* @Last Modified by:   Nicot
* @Last Modified time: 2018-01-01 14:47:45
*/

var schedule = require('node-schedule');
var cache = require('../util/cacheUtil.js');
var io = require('../socketio/io.js');
var news = require('../news/news.js');

exports.start = function() {
    console.log('init newsJob start');
    news.run();
    //每30分钟拿一次新新闻
    var rule30min = new schedule.RecurrenceRule();
    rule30min.minute = [0, 30];
    var job1 = schedule.scheduleJob(rule30min, function(){
        news.run();
    });

    //每30秒推送一次新闻
    var rule30sec = new schedule.RecurrenceRule();
    rule30sec.second = [0, 30];
    var job2 = schedule.scheduleJob(rule30sec, function(){
        io.broadcast('news', JSON.stringify(news.getNews()));
    });

    console.log('init newsJob job end');
};
