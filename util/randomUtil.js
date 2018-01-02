/* 
* @Author: Nicot
* @Date:   2016-03-27 10:23:56
* @Last Modified by:   Nicot
* @Last Modified time: 2016-03-27 13:09:01
*/

//获取随机字符串
exports.getRandomCharacter = function(N){
    const charTable = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    var res = '';
    for(var i = 0;i < N;i++){
        res = res + charTable[getRandom(0,24)];
    }
    return res;
};  
//获取[a,b)区间内的随机数
exports.getRandom = function(a,b){

    if(a >= b){
        return 0;
    }
    var seed = Math.random();
    var num = seed * (b - a) + a;
    return parseInt(num,10);
};