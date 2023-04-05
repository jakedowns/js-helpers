import {is_browser} from '@app_next/utils/browser_or_server';
if(is_browser && window?.console){
    window.console.__proto__.success = function(msg){
        console.log('%c '+msg, 'background: #222; color: #bada55'); // pretty bada55
    }
}

export const waitForSelector = async function(elementSelector,maxSeconds,parentElement){
    console.warn('waiting for selector',JSON.stringify({elementSelector,maxSeconds}));
    parentElement = parentElement ?? document;
    return waitReturnTrue(()=>{
        let found = parentElement.querySelectorAll(elementSelector).length > 0
        if(found){
            console.success('selector found '+elementSelector);
        }
        return found;
    },maxSeconds)
}

export const waitReturnTrue = async function(callback,maxSeconds){
    if(!maxSeconds){
        maxSeconds = 10
    }
    console.warn('[waitReturnTrue] waiting for callback to return true',JSON.stringify({callback,maxSeconds}));
    return new Promise((resolve,reject)=>{
        let startTime = Date.now();
        let checker;
        let check = function(){
            let result = callback();
            if(result){
                clearInterval(checker); checker = null;
                console.success('[waitReturnTrue] success');
                resolve(result);
            }else{
                if(Date.now() - startTime > (maxSeconds*1000)){
                    clearInterval(checker); checker = null;
                    console.warn('max timeout reached') // warn for call stack
                    const err = {
                        msg:'[waitReturnTrue] max timeout reached',
                        callback
                    };
                    reject(err);
                    throw new Error(err.msg, {callback});
                }else{
                    // continue to check
                }
            }
        }
        checker = setInterval(check,500);
    })
}
