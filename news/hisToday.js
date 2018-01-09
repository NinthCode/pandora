/* 
* @Author: Nicot
* @Date:   2018-01-07 12:50:30
* @Last Modified by:   Nicot
* @Last Modified time: 2018-01-07 14:29:03
*/

var request = require('request');
var cheerio = require('cheerio');
var cache = require('../util/cacheUtil.js');


exports.run = function() {
    crawlHtmlData();
    handlerInterfaceData(1);
}

function crawlHtmlData() {
     request("http://www.todayonhistory.com/", function(error, response, body) {
        if(response && response.statusCode == 200) {
            try {
                $ = cheerio.load(body);
                var hisInfoLs = $('.oh').find('.circlel');
                var hisInfoRs = $('.oh').find('.circler');
                var his = parserTimeData(hisInfoLs).concat(parserTimeData(hisInfoRs));
                cache.get('news').push({news: his, length: his.length, iter: 0});
            } catch(e) {
                console.log('get today his html info error ' + error);
            }
        } else {
            console.log('get today his html info error ' + error);
        }
     });
};

function parserTimeData(hisNodes) {
    var hisDatas = [];
    for(var i = 0;i < hisNodes.length;i++) {
        var hisData = {};
        try {
            var temp = cheerio.load(hisNodes[i]);
            if(temp('li').hasClass('poh')) {
                continue;
            }
            if(temp('li').children('div').hasClass('pic')) {
                hisData.title = temp('.t').children('span').text().trim();
                hisData.abstract = temp('.t').children('a').text().trim();
            } else {
                hisData.title = temp('.text').children('span').text().trim();
                hisData.abstract = temp('.text').children('a').text().trim();
            }
        } catch(e) {
            console.log(e);
        }
        hisData.type = '历史上的今天';
        hisDatas.push(hisData);
    }
    return hisDatas;
};

function handlerInterfaceData(page) {
    var url = "http://www.todayonhistory.com/index.php?m=content&c=index&a=json_event&pagesize=40&page=" + page;
    var month = new Date().getMonth() + 1;
    var day = new Date().getDate();
    url = url + "&month=" + month;
    url = url + "&day=" + day;
    request(url, function(error, response, body) {
        if(response && response.statusCode == 200) {
            try {
                if(body == 0) {
                    return;
                } else {
                    his = [];
                    var hisDatas = JSON.parse(body);
                    for(var i in hisDatas) {
                        var hisData = {};
                        hisData.title = hisDatas[i].solaryear + '年' + month + '月' + day + '日';
                        hisData.abstract = hisDatas[i].title;
                        hisData.type = '历史上的今天';
                        his.push(hisData);
                    }
                    cache.get('news').push({news: his, length: his.length, iter: 0});
                    handlerInterfaceData(page + 1);
                }
            } catch(e) {
                console.log('get today his interface info error ' + error);
            }
        } else {
            console.log('get today his interface info error ' + error);
        }
     });

}