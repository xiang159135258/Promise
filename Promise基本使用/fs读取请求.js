const { rejects } = require('assert')
const fs = require('fs')

// 回调函数
// fs.readFile('./resource/content.txt', (err, data) => {
//     if (err) throw err;
//     console.log(data.toString());
// })

// Promise
let p = new Promise((resolve , reject) => {
    fs.readFile('./resource/content.txt', (err, data) => {
        // 如果出错
        if (err) reject(err);
        // 成功
        resolve(data);
    });
});

p.then(value => {
    console.log(value.toString());
}), reason=>{
    console.log(reason);
}