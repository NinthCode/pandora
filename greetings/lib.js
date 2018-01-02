/* 
* @Author: Nicot
* @Date:   2018-01-03 00:25:31
* @Last Modified by:   Nicot
* @Last Modified time: 2018-01-03 00:42:46
*/

module.exports = {
    connect: ['你好啊，很高兴见到你！', '你来啦~', '恭喜您成功连接系统'],
    weather: [
        {
            expression: '$.temp < -1',
            characters: ['天气有点冷~，多穿点衣服！', '天气凉，注意保暖哦', 'so cold ~~'],
            level: 2
        },
        {
            expression: '$.wind > 4',
            characters: ['今天有大风哦，注意安全！'],
            level: 1
        },
        {
            express: '$.weather == 0',
            characters: ['今天有雨，别忘记带伞！', '今天可能会下雨哦~~'],
            level: 3
        },
        {
            express: 'true',
            characters: ['今天天气不错，哈哈', '风和日丽啊，祝你开心哦~'],
            level: -1
        }
    ]
};