/* 
* @Author: Nicot
* @Date:   2017-12-23 23:53:07
* @Last Modified by:   Nicot
* @Last Modified time: 2017-12-30 17:38:32
*/
exports.get = function(key) {
    if(global.varCache == undefined) {
        global.varCache = {};
    }
    return global.varCache[key];
};

exports.set = function(key, value) {
    if(global.varCache == undefined) {
        global.varCache = {};
    }
    global.varCache[key] = value;
}