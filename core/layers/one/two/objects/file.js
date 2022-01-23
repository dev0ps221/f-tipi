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
        // console.log(opts)
    }

    type(){
        return this._type.toString().split('{')[0].split('class')[1].trim().split('extends')[0].trim()
    }

    details(){

    }

    delete(){

    }

    get(){
        return {
            type:this.type(),
            infos:this.raw
        }
    }

    rename(){

    }

    download(){

    }

    upload(){

    }

    who(){
        return this
    }

}


module.exports = FtipiFile
