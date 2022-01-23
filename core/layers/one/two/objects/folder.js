const path = require('path')
const FtipiFile = require(path.join(__dirname,'file'))
class FtipiFolder extends FtipiFile{
    constructor(data,opts={}){
        super(data,opts)
        this._type = FtipiFolder
        return this
    }
    open(){

    }
}
module.exports = FtipiFolder 
