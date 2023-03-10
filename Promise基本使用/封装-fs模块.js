/**
 * 封装函数 mineReadfile 读取文件内容
 * 参数： path文件路径
 * 返回： promise 对象
 * **/

function mineReadfile(path) { 
    return new Promise((resolve, reject) => {
        require('fs').readFile(path, (err, data) => {
            if(err) reject(err);
            resolve(data)
        });
    })
}

mineReadfile('./resource/content.txt')
.then(value => {
    console.log(value.toString());
}), reason=>{
    console.log(reason);
}