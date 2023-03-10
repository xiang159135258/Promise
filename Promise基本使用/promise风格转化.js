/**
 * util.promisify 方法
 * **/
const util = require('util');
const fs = require('fs');

let mineReadfile = util.promisify(fs.readFile);

mineReadfile('./resource/content.txt')
.then(value => {
    console.log(value.toString());
}), reason=>{
    console.log(reason);
}