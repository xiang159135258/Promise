class Promise{

    // 构造方法
    constructor(executor){

        // 保存this
        const that = this

        // 添加属性
        this.PromiseState = "pending";
        this.PromiseResult = null;
        // 保存多个回调函数,
        this.callBacks = [];

        // resolve 函数
        function  resolve(data) { 

            // 判断状态
            if(that.PromiseState === 'pending'){
                // 1. 修改对象状态 (PromiseState)
                that.PromiseState = 'fulfilled';
                // 2. 设置对象结果值 (PromiseResult)
                that.PromiseResult = data;
                //  遍历执行成功的回调函数
                //使回调函数异步执行
                setTimeout(()=>{
                    that.callBacks.forEach(item => {
                        item.onResolved(data);
                    });
                })
            }
        

        }

        //  reject 函数
        function  reject(data) { 
        // 判断状态
            if(that.PromiseState === 'pending'){
                // 1. 修改对象状态 (PromiseState)
                that.PromiseState = 'rejected';
                // 2. 设置对象结果值 (PromiseResult)
                that.PromiseResult = data;
                //  遍历执行成功的回调函数
                //使回调函数异步执行
                setTimeout(()=>{
                    that.callBacks.forEach(item => {
                        item.onReject(data);
                    });
                })
            }
        }

        try{
            // 同步调用 [执行器函数]
            executor(resolve, reject);
        }catch(e){
            reject(e);
        }
    
    }

    then(onResolved, onReject){
        // 保存this
        const self = this;

        // 判断回调函数参数
        if(typeof onReject !== 'function'){
            onReject = reason => {
                throw reason;
            }
        }
        if(typeof onResolved !== 'function'){
            onResolved = value => value;
        }


        return new Promise((resolve, reject) => {
            // 封装函数 ： 获取回调函数的执行结果
            function callback(type) { 
                try{
                    // 获取回调函数的执行结果
                    let result = type(self.PromiseResult);
                    if (result instanceof Promise){
                        // 如果是Promise对象
                        result.then(v => {
                            resolve(v);
                        }, r=>{
                            reject(r);
                        })
                    }else{
                        // 结果的对象状态为 [成功]
                        resolve(result);
                    }
                }catch(e){
                    reject(e);
                }
            }
            // 调用回调函数
            if(this.PromiseState === 'fulfilled'){
                //使回调函数异步执行
                setTimeout(()=>{
                    callback(onResolved);
                })
            }

            if(this.PromiseState === 'rejected'){
                //使回调函数异步执行
                setTimeout(()=>{
                    callback(onReject);
                })
            }

            
            // 执行异步操作时，保存回调函数
            if(this.PromiseState === 'pending'){
                this.callBacks.push({
                    // onResolved : onResolved,
                    // onReject : onReject
                    // 实现异步回调
                    onResolved : function () { 
                        callback(onResolved);                   
                        },
                    onReject: function () { 
                        callback(onReject);
                    }
                });
            }
        })
    }

    catch(onRejected){
        return this.then(undefined, onRejected)
    }

    // 添加 resovle 方法: 该方式时函数对象方法，不是对象方法
    static resolve(value) { 
        // 返回Promise对象
        return new Promise((resolve, reject) => {
            if (value instanceof Promise){
                value.then(v=>{
                    resolve(v)
                }, r=> {
                    reject(r)
                })
            }else{
                // 状态设置为成功
                resolve(value);
            }
        });
    }

    static reject(reason) { 
        // 返回Promise对象
        return new Promise((resolve, reject) => {
            reject(reason);
        });
    }

    static all(promises) { 
        return new Promise((resolve, reject) => {
            // 申明变量
            let count = 0;
            // 存放成功结果
            let arr = [];
            // 遍历
            for (let i=0; i<promises.length; i++){
                promises[i].then(v => {
                    // 进入该循环说明对象状态时成功的
                    count++;
                    arr[i] = v;
                    if(count === promises.length){
                        resolve(arr)
                    }
                },r => {
                    reject(r);
                })
            }
        })
    }

    static race(promises) { 
        return new Promise((resolve, reject)=>{
            // 遍历
            for (let i=0; i<promises.length; i++){
                promises[i].then(v => {
                    // 进入该循环说明对象状态时成功
                    resolve(v)
                },r => {
                    reject(r);
                })
            }
        })
    }
}