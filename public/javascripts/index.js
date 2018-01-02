/* 
* @Author: Nicot
* @Date:   2016-03-29 23:12:03
* @Last Modified by:   Nicot
* @Last Modified time: 2018-01-03 00:20:21
*/

//落日时间
var ss = {
    ssh: 18,
    ssm: 0
};

var sr = {
    srh: 6,
    srm: 0
};
jQuery(document).ready(function() {

    $.backstretch("/images/black.png");
    $.updateDateTime(document);
    
    setInterval(function() {
        //更新时间
        $.updateDateTime(document);
    },1000);

    var socket = io();

    socket.on('connect', function() {
        socket.emit('hello', '你大爷');
    });

    socket.on('welcome', function(msg) {
        var welcome = document.getElementById('welcome');
        var date = new Date();
        if(date.getHours() >= sr.srh && date.getHours() < 9) {
            welcome.innerText = '早上好，' + msg + '，开心快乐每一天哦！';
        } else if(date.getHours() >= 12 && date.getHours() < ss.ssh) {
            welcome.innerText = '下午好，' + msg + '^_^';
        } else if(date.getHours() >= 9 && date.getHours() < 12) {
            welcome.innerText = '上午好，' + msg + '^_^';
        } else {
            welcome.innerText = '晚上好，' + msg + '^_^';
        }
        
    });

    socket.on('byby', function(msg) {
        var welcome = document.getElementById('welcome');
        welcome.innerText = msg;
    });

    socket.on('weather', function(msg) {
        $.updateWeather(document, msg);
    });

    socket.on('news', function(msg) {
        var title = document.getElementById('title');
        var abstract = document.getElementById('abstract');
        var news = JSON.parse(msg);
        title.innerText = news.title;
        abstract.innerText = news.abstract == '' ? '' : news.abstract.substring(0, 100) + '...';
    });
});

(function($){
    Date.prototype.Format = function (fmt) { //author: meizz   
        var o = {  
            "M+": this.getMonth() + 1, //月份   
            "d+": this.getDate(), //日   
            "H+": this.getHours(), //小时   
            "m+": this.getMinutes(), //分   
            "s+": this.getSeconds(), //秒   
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
            "S": this.getMilliseconds() //毫秒   
        };  
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));  
        for (var k in o)  
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));  
        return fmt;  
    } 

    $.updateDateTime = function(doc) {
        var clockhm = doc.getElementById('clock-hm');
        var clocksec = doc.getElementById('clock-sec');
        var clockdate = doc.getElementById('clock-date');
        clockdate.innerText = "星期"  + new Date().getDay() + " , " + new Date().Format("yyyy年MM月dd日");
        clockhm.innerText = new Date().Format("HH:mm");
        clocksec.innerText = new Date().Format("ss");
    }

    $.updateWeather = function(doc, msg) {
        var weather = JSON.parse(msg);
        if(weather.type == 'nowWeather') {
            var nowtemp = doc.getElementById('nowtemp');
            var updateTime = new Date(weather.updateTime);
            nowtemp.innerText = '实时温度：' + weather.weather.tmp + '℃ 天气：' + weather.weather.cond_txt;
        } else if(weather.type == 'nowAir') {
            var airstatus = doc.getElementById('airstatus');
            var qlty = weather.air.qlty == undefined ? '极好': weather.air.qlty;
            airstatus.innerText = '空气质量：' + qlty + '（' + weather.air.aqi + '）';
        } else if(weather.type == 'todayWeather') {
            var todaytemp = doc.getElementById('todaytemp');
            var todayweather = doc.getElementById('todayweather');
            var todaywind = doc.getElementById('todaywind');
            var today = weather.forecast[0];
            todaytemp.innerText = today.tmp_min + '℃ ~ ' + today.tmp_max + '℃';
            ss.ssh = parseInt(today.ss.split(':')[0]);
            ss.ssm = parseInt(today.ss.split(':')[1]);
            sr.srh = parseInt(today.sr.split(':')[0]);
            sr.srm = parseInt(today.sr.split(':')[1]);
            var date = new Date();
            if(date.getHours() > ss.ssh && date.getMinutes() > ss.ssm) {
                todayweather.innerText = today.cond_txt_n;
            } else {
                todayweather.innerText = today.cond_txt_d;
            }

            todaywind.innerText = today.wind_dir + ' ' + today.wind_sc + '级';
        }
    }
})(jQuery);