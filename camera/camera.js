/* 
* @Author: Nicot
* @Date:   2017-12-31 13:22:05
* @Last Modified by:   Nicot
* @Last Modified time: 2017-12-31 13:48:10
*/
var exec = require('child_process').exec;
var cache = require('../util/cacheUtil.js');

exports.run = function() {
    cache.set('cameraStatus', true);
    var cmd = 'python ' + __dirname + '/camera.py'
    exec(cmd, function(error, stdout, stderr) {
        if(error) {
            console.log('执行Camera Py报错, ' + error + ', stderr:' + stderr);
            cache.set('cameraStatus', false);
        }
        if(stdout.length > 1) {
            console.log('Camera out' + stdout);
        }
    });
    
};

exports.check = function() {
    var grep = 'python ' + __dirname + '/camera.py'
    var cmd = 'ps aux | grep "' + grep + '" | grep -v grep'
    console.log('check camera, cmd:' + cmd);
    exec(cmd, function(error, stdout, stderr){
        if(stdout.length > 1) {
            console.log('camera is normal');
            cache.set('cameraStatus', true);
        } else {
            console.log('camera is error');
            cache.set('cameraStatus', false);
        }
    });
};