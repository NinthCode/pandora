/* 
* @Author: Nicot
* @Date:   2017-12-31 11:30:05
* @Last Modified by:   Nicot
* @Last Modified time: 2017-12-31 13:43:31
*/

var schedule = require('node-schedule');
var cache = require('../util/cacheUtil.js');
var camera = require('../camera/camera.js');

exports.start = function() {
    console.log('init runCameraJob start');
    camera.run();
    //每5分钟检查一次是否在运行
    var rule5min = new schedule.RecurrenceRule();
    rule5min.minute = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    var job1 = schedule.scheduleJob(rule5min, function(){
        camera.check();
        if(!cache.get('cameraStatus')) {
            console.log('restart camera py');
            camera.run();
        }
    });
    console.log('init camera job end');
};

