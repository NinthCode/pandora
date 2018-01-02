/* 
* @Author: Nicot
* @Date:   2016-03-20 19:37:40
* @Last Modified by:   Nicot
* @Last Modified time: 2018-01-02 23:40:37
*/

var cache = require('../util/cacheUtil.js');

//配置导出
module.exports = {
    "weatherKey": "和风天气API",
    "weatherUrl": {
        forecast: "https://free-api.heweather.com/s6/weather/forecast?",
        now: "https://free-api.heweather.com/s6/weather/now?",
        airNow: "https://free-api.heweather.com/s6/air/now?"
    },
    "camera": true
};