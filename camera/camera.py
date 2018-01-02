#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Author: Nicot
# @Date:   2017-11-18 21:11:40
# @Last Modified by:   Nicot
# @Last Modified time: 2018-01-02 23:08:27
import requests
import time
import json
import RPi.GPIO as GPIO
import base64
import picamera
import sys
import os


FACETOKEN = {}
CALOCK = False
STRANGERCOUNT = 0
CONF = {
    'api_key': '',
    'api_secret': '',
    'faceset_token': '',
    'human_gpio': '12',
    'infrared_gpio': '16' 
}

def logger(level, log):
    global logouter
    logtime = time.strftime('%Y-%m-%d-%H-%M-%S',time.localtime(time.time()))
    loglevel = '[debug]'
    if level == 0:
        loglevel = '[debug]'
    elif level == 1:
        loglevel = '[info]'
    elif level == 2:
        loglevel = '[error]'
    else:
        loglevel = '[debug]'
    log = loglevel + ' ' + logtime + ' ' + log
    try:
        os.system('echo "' + log + '" >> ' + sys.path[0] + '/camera.out');
    except IOError:
        print('logger io error')
    pass


def initconf():
    global CONF
    logger(1, 'init config start')
    try:
        input = open(sys.path[0] + '/camera.conf', 'r')
        lines = input.readlines()
        for line in lines:
            kv = line.split('=')
            logger(1, 'config key:' + kv[0].strip() + ', config value:' + kv[1].strip())
            CONF[kv[0].strip()] = kv[1].strip()
    except IOError:
        logger(2, 'config file not found!')
        return False
    except OverflowError:
        logger(2, 'wrong config file!')
        return False
    logger(1, 'init config end')
    return True

def initgpio():
    global CONF
    try:
        logger(1, 'init gpio start')
        GPIO.setwarnings(False)
        GPIO.setmode(GPIO.BOARD)
        GPIO.setup(int(CONF['human_gpio']), GPIO.IN)
        GPIO.setup(int(CONF['infrared_gpio']), GPIO.IN)
    except RuntimeError, Argument:
        logger(2, 'wrong gpio config, err:' + str(Argument))
        return False
    logger(1, 'init gpio end')
    return True

def initfacetk():
    global FACETOKEN
    logger(1, 'init face token start')
    try:
        input = open(sys.path[0] + '/facetoken.csv', 'r')
        lines = input.readlines()
        for line in lines:
            kv = line.split(',')
            logger(1, 'facename:' + kv[0] + ', facetoken:' + kv[1].strip())
            FACETOKEN[kv[1].strip()] = kv[0]
    except IOError:
        logger(2, 'facetoken file not found!')
        return False
    except OverflowError:
        logger(2, 'wrong face token')
        return False
    logger(1, 'init face token end')
    return True


#初始化
def init():
    return initconf() and initgpio() and initfacetk()

#红外人体感应
def humandetct():
    return GPIO.input(int(CONF['human_gpio'])) == 1;

#红外避障
def infrareddetct():
    return True;

#photo进行base64编码
def encodepic(filename):
    input = open(filename, 'rb')
    picstring = base64.b64encode(input.read())
    input.close()
    return picstring

#人脸识别
def facerecognition(pic):
    reqdata = {
        'api_key': CONF['api_key'],
        'api_secret': CONF['api_secret'],
        'image_base64': pic,
        'faceset_token': CONF['faceset_token'],
        'return_result_count':5
    }

    resp = requests.post('https://api-cn.faceplusplus.com/facepp/v3/search', reqdata)
    if resp.status_code == 200:
        respdict = json.loads(resp.text)
        if(len(respdict['faces']) == 0):
            return 'you are not human !'
        if(len(respdict['results']) == 0):
            return "I don't know you."
        firstresult = respdict['results'][0]
        if firstresult['confidence'] > 50:
            return firstresult
        else:
            return "I don't know you."
    pass

def takephoto():
    photoname = sys.path[0] + '/pic/' + time.strftime('%Y-%m-%d-%H-%M-%S',time.localtime(time.time())) + '.jpg'
    camera = picamera.PiCamera()
    try:
        camera.capture(photoname)
    except RuntimeError,Argument:
        logger(2, 'takephoto error!' + str(Argument))
    finally:
        camera.close()
    return photoname

def pushWelcome(name):
    reqdata = {
        'key':'python',
        'name':name
    }
    resp = requests.post('http://127.0.0.1:3000/pushWelcome', reqdata)
    if resp.status_code == 200 and resp.text == 'OK':
        logger(1, 'send successfully');
    else :
        logger(1, 'send error');
    pass

def pushUnlock():
    reqdata = {
        'key':'python'
    }
    resp = requests.post('http://127.0.0.1:3000/pushUnlock', reqdata)
    if resp.status_code == 200 and resp.text == 'OK':
        logger(1, 'send successfully');
    else :
        logger(1, 'send error');
    pass

def triggercount(num, interval):
    unlockcount = 0;
    for i in range(int(num)):
        if humandetct() == False:
            unlockcount = unlockcount + 1
            time.sleep(interval)
    return unlockcount


def logic():
    global CALOCK
    global STRANGERCOUNT
    if CALOCK == True:
        if triggercount(10, 1) > 5:
            CALOCK = False
            logger(1, 'UNLOCK!!')
            pushUnlock();
        else:
            time.sleep(2)
    elif triggercount(5, 0.2) > 0:
        time.sleep(1)
        if triggercount(5, 0.2) > 0:
            os.system('xset dpms force on');
            logger(1, 'aubergine !')
            picname = takephoto()
            piccode = encodepic(picname)
            faceres = facerecognition(piccode)
            if type(faceres) == type({}):
                CALOCK = True
                logger(1, 'LOCK!!')
                return faceres
            else:
                if STRANGERCOUNT > 5:
                    CALOCK = True
                    STRANGERCOUNT = 0
                else:
                    STRANGERCOUNT = STRANGERCOUNT + 1
                return {'face_token':'msr'}
    return None

if __name__ == '__main__':
    if init():
        logger(1, 'initialization successfully !')
    else:
        logger(2, 'initialization failed !')
        sys.exit(1)
    while True:
        try:
            faceres = logic()
            if faceres != None:
                pushWelcome(FACETOKEN[faceres[u'face_token']]);
                logger(1, '你好，' + FACETOKEN[faceres[u'face_token']])
            else:
                time.sleep(1)
                logger(1, 'Nobody is close')
        except RuntimeError,Argument:
            logger(2, 'ERROR!' + str(Argument))
    pass