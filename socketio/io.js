/* 
* @Author: Nicot
* @Date:   2017-12-24 11:45:58
* @Last Modified by:   Nicot
* @Last Modified time: 2018-01-03 00:43:49
*/
var cache = require('../util/cacheUtil.js');
var news = require('../news/news.js');

exports.start = function() {
    var io = cache.get('io');
    console.log('init socket io');
    if(io == undefined) {
        console.log('init socket io error');
        return;
    }
    io.on('connection', function(socket) {
        console.log("成功连接！");
        socket.on('hello', function(name) {
            console.log('hello ' + name);
            //更新天气情况
            socket.emit('weather', JSON.stringify(cache.get('nowWeather')));
            socket.emit('weather', JSON.stringify(cache.get('nowAir')));
            socket.emit('weather', JSON.stringify(cache.get('todayWeather')));
            //更新新闻
            socket.emit('news', JSON.stringify(news.getNews()));
            //更新欢迎语
            socket.emit('welcome', '很高兴见到你！');
        });
    });
};

//广播
exports.broadcast = function(type, msg) {
    var io = cache.get('io');
    io.sockets.emit(type, msg);
};