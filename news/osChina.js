/* 
* @Author: Nicot
* @Date:   2018-01-01 14:19:45
* @Last Modified by:   Nicot
* @Last Modified time: 2018-01-01 16:58:50
*/

var request = require('request');
var cheerio = require('cheerio');
var cache = require('../util/cacheUtil.js');

exports.run = function() {
    request("https://www.oschina.net/news", function(error, response, body) {
        if(response && response.statusCode == 200) {
            try {
                $ = cheerio.load(body);
                var spans = $('.news-list-item').find($('.main-info'));
                var osNews = [];
                for(var i = 0; i < spans.length; i++) {
                    try {
                        var temp = cheerio.load(spans[i]);
                        osNews.push({
                            title: temp('.title').text().trim(),
                            abstract: temp('.sc').text().trim(),
                            time: temp('.mr').text().trim(),
                            type: 'osc'
                        });
                    } catch(ee) {
                        console.log(ee);
                    }
                }
                cache.get('news').push({news: osNews, length: spans.length, iter: 0});
            } catch(e) {
                console.log('get osc news error' + e);
            }
        } else {
            console.log('get osc news error, code is :' + response.statusCode);
        }
    });
};