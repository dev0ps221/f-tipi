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