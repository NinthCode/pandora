/* 
* @Author: Nicot
* @Date:   2017-12-24 01:13:50
* @Last Modified by:   Nicot
* @Last Modified time: 2018-01-01 10:07:50
*/

var schedule = require('node-schedule');
var request = require('request');
var config = require('../config/config.js');
var cache = require('../util/cacheUtil.js');
var util = require('util');
var io = require('../socketio/io.js')

exports.start = function(address) {
    console.log('init weather job start');
    updateNowWeather(address);
    updateTodayWeather(address);
    //每10分钟更新一次空气与实时天气
    var rule10min = new schedule.RecurrenceRule();
    rule10min.minute = [0, 10, 20, 30, 40, 50];
    var job1 = schedule.scheduleJob(rule10min, function(){
        updateNowWeather(address);
    });

    //每一个小时更新一次今日天气
    var rule12hour = new schedule.RecurrenceRule();
    rule12hour.hour = [0, 12];
    var job2 = schedule.scheduleJob(rule12hour, function(){
        updateTodayWeather(address);
    });
    console.log('init weather job end');
    return [job1, job2];
}

function updateNowWeather(address) {
    try {
        var nowWeatherUrl = config.weatherUrl['now'] + 'location=' + address + '&key=' +config.weatherKey;
        var nowAirUrl = config.weatherUrl['airNow'] + 'location=' + address + '&key=' +config.weatherKey;
        request(nowWeatherUrl, function(error, response, body) {
            console.log('获取实时天气,url: ' + nowWeatherUrl + ', code: ' + response.statusCode + ', body: ' + body);
            //console.log(util.format('获取实时天气完成，url: %s, error: %s, code: %d, body: %s', nowWeatherUrl, error, response.statusCode，body));
            if(response && response.statusCode == 200) {
                //处理数据
                var bodyJSON = JSON.parse(body);
                if(bodyJSON.HeWeather6[0].status == 'ok') {
                    var data = bodyJSON.HeWeather6[0];
                    var nowWeather = {
                        type: 'nowWeather',
                        updateTime: new Date(data.update.loc),
                        weather: data.now
                    };
                    cache.set('nowWeather', nowWeather);
                    io.broadcast('weather', JSON.stringify(nowWeather));
                } else {
                    return false;
                }
            }
        });

        request(nowAirUrl, function(error, response, body) {
            console.log('获取实时空气情况完成,url: ' + nowAirUrl + ', code: ' + response.statusCode + ', body: ' + body);
            //console.log(util.format('获取实时空气情况完成，url: %s, error: %s, code: %d, body: %s', nowAirUrl, error, response.statusCode，body));
            if(response && response.statusCode == 200) {
                //处理数据
                var bodyJSON = JSON.parse(body);
                if(bodyJSON.HeWeather6[0].status == 'ok') {
                    var data = bodyJSON.HeWeather6[0];
                    var nowAir = {
                        type: 'nowAir',
                        updateTime: new Date(data.air_now_city.pub_time),
                        air: data.air_now_city
                    };
                    cache.set('nowAir', nowAir);
                    io.broadcast('weather', JSON.stringify(nowAir));
                } else {
                    return false;
                }
            } else {
                return false;
            }
        });
    } catch(error) {
        console.log('updateNowWeather is error:' + error);
        return false;
    }
    return true;
}

function updateTodayWeather(address) {
    try {
        var forecastUrl = config.weatherUrl['forecast'] + 'location=' + address + '&key=' +config.weatherKey;
        request(forecastUrl, function(error, response, body) {
            console.log('获取当日情况完成,url: ' + forecastUrl + ', code: ' + response.statusCode + ', body: ' + body);
            // console.log(util.format('获取当日情况完成，url: %s, error: %s, code: %d, body: %s', forecastUrl, error, response.statusCode，body));
            if(response && response.statusCode == 200) {
                //处理数据
                var bodyJSON = JSON.parse(body);
                if(bodyJSON.HeWeather6[0].status == 'ok') {
                    var data = bodyJSON.HeWeather6[0];
                    var todayWeather ={
                        type: 'todayWeather',
                        updateTime: new Date(data.update.loc),
                        forecast: data.daily_forecast
                    };
                    cache.set('todayWeather', todayWeather);
                    io.broadcast('weather', JSON.stringify(todayWeather));
                } else {
                    return false;
                }
            } else {
                return false;
            }
        });
    } catch(error) {
        console.log('updateTodayWeather is error:' + error);
        return false;
    }
    return true;
}