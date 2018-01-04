/* 
* @Author: Nicot
* @Date:   2018-01-03 00:25:31
* @Last Modified by:   Nicot
* @Last Modified time: 2018-01-04 20:26:37
*/

module.exports = {
    random: ['weather', 'festival'],
    connect: [
        {
            expression: 'true',
            characters: ['你好啊，很高兴见到你！', '你来啦~', '恭喜您成功连接系统'],
            level: -1
        }
    ],
    weather: [
        {
            expression: 'weather.temp < -1',
            characters: ['天气有点冷~，多穿点衣服！', '天气凉，注意保暖哦', 'so cold ~~'],
            level: 2
        },
        {
            expression: 'weather.wind > 4',
            characters: ['今天有大风哦，注意安全！'],
            level: 1
        },
        {
            expression: 'weather.weather == 0',
            characters: ['今天有雨，别忘记带伞！', '今天可能会下雨哦~~'],
            level: 3
        },
        {
            expression: 'true',
            characters: ['今天天气不错，哈哈', '风和日丽啊，祝你开心哦~'],
            level: -1
        }
    ],
    festival: [
        {
            expression: 'date.m == 2 && $.date.d == 18',
            characters: ['祝你生日快乐哦', '生日快乐，哈哈'],
            level: 3
        },
        {
            expression: 'date.m == 2 && $.date.d == 25',
            characters: ['薇薇生日快乐哦！'],
            level: 3
        },
        {
            expression: 'festival.indexOf("元旦") >= 0',
            characters: ['元旦快乐~~'],
            level: 3
        }
    ]
};