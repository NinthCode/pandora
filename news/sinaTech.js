/* 
* @Author: Nicot
* @Date:   2018-01-01 15:34:18
* @Last Modified by:   Nicot
* @Last Modified time: 2018-01-01 16:56:59
*/

var request = require('request');
var cheerio = require('cheerio');
var cache = require('../util/cacheUtil.js');

exports.run = function() {
    request("http://tech.sina.com.cn", function(error, response, body) {
        if(!error && response && response.statusCode == 200) {
            try {
                    $ = cheerio.load(body);
                    var as = $('.tech-news').find($('a'));
                    var techNews = [];
                    for(var i = 0; i < as.length;i++) {
                        try {
                            var temp = cheerio.load(as[i]);
                            techNews.push({
                                title: temp.text().trim(),
                                abstract: '',
                                time: '',
                                type: 'sina-tech'
                            });
                        } catch(ee) {
                            console.log(ee);
                        }
                    }
                    cache.get('news').push({news: techNews, length: as.length, iter: 0});
            } catch(e) {
                console.log('get sina tech news error ' + e);
            }
        } else {
            console.log('get sina tech news error, error' + error + ', response: ' + response);
        }
    });
};