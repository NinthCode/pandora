var express = require('express');
var router = express.Router();
var io = require('../socketio/io.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/pushWelcome', function(req, res, next) {
    if(req.body.key == 'python') {
        io.broadcast('welcome', req.body.name);
        res.send('OK');
    } else {
        res.send('error');
    }
});

router.post('/pushUnlock', function(req, res, next) {
    if(req.body.key == 'python') {
        io.broadcast('byby', '拜拜，祝你好运！');
        res.send('OK');
    } else {
        res.send('error');
    }
});

module.exports = router;
