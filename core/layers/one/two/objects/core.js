class FtipiFile{
    


    constructor(data,opts={}){
        this.processopts(opts)
        this.processData(data)
        this._type = FtipiFile
        return this
    }

    processData(data){
        this.raw = data
    }
        
    see(val){
        return this.raw.hasOwnProperty(
            val
        ) ? this.raw[val] : null
    }

    processopts(opts){
        console.log(opts)
    }

    type(){
        return this._type.toString().split('{')[0].split('class')[1].trim().split('extends')[0].trim()
    }

    details(){

    }

    delete(){

    }

    get(){

    }

    rename(){

    }

    download(){

    }

    upload(){

    }

}

class FtipiFolder extends FtipiFile{
    constructor(data,opts={}){
        super(data,opts)
        this._type = FtipiFolder
        return this
    }
    processData(data){
        console.log('folder data is ',data)
    }
    who(){
        return this
    }
}

module.exports = {
    FtipiFolder,FtipiFile
}