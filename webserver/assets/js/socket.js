const sock = io('/')

function get(trigger,cb){
    sock.on(
        trigger,cb
    )
}

function post(trigger,data,cb){
    sock.emit(
        trigger,data
    )
    if(cb) get(
        `${trigger}Res`,cb
    )
}

function COOKIES(){
    let cooks = {};
    document.cookie.split(';').forEach(
        elem=>{
            let cook = elem.trim().split('=');cooks[cook[0]]=cook[1]
        }
    )
    return cooks
}

function hasServs(){
    return COOKIES().hasOwnProperty('servers')&&JSON.parse(COOKIES()['servers']).length
}
if(hasServs()){
    
}