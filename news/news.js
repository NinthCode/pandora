/* 
* @Author: Nicot
* @Date:   2018-01-01 14:45:57
* @Last Modified by:   Nicot
* @Last Modified time: 2018-01-01 16:53:28
*/
var random = require('../util/randomUtil.js');
var cache = require('../util/cacheUtil.js');
var oschina = require('../news/osChina.js');
var sinaTech = require('../news/sinaTech.js');

exports.getNews = function() {
    if(cache.get('news').length != 0) {
        var index = random.getRandom(0, cache.get('news').length);
        var xnews = cache.get('news')[index];
        news = xnews.news[xnews.iter];
        xnews.iter = xnews.iter + 1;
        if(xnews.iter == xnews.length) {
            xnews.iter = 0;
        }
        cache.get('news')[index] = xnews;
        return news;
    } else {
        return {};
    }
}

exports.run = function() {
    if(cache.get('news') == undefined) {
        cache.set('news', []);
    }
    oschina.run();
    sinaTech.run();
}