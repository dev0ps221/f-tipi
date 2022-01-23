const path = require('path')
const { clearInterval } = require('timers')
const currentpath = path.join(__dirname)
const FtipiFile   = require(path.join(currentpath,'/objects/file'))
const FtipiFolder = require(path.join(currentpath,'/objects/folder'))
const currentobjectspath = path.join(currentpath,'objects')



class ConnectionActions{


  async cwd(pth,cb,prom=null){
    return await this.client.cwd(pth,cb,prom)
  }

  async pwd(cb){
    return await this.client.pwd(
      (e,data)=>{
        if(e)console.log(e)
        else{
          this.currentdir = data 
        }
        cb(this.currentdir)
      }  
    )

  }

  async list(pth="",cb=(e,r)=>{console.log("DEFAULT ACTION >> PRINT <<",e,r)}){
    return await this.client.list(pth,cb)
  }

  async ensureDir(pathname){
    return await this.client.ensureDir(pathname)
  }

  isReady(){
    if(!this.hasOwnProperty('ready')) return
    return this.ready
  }

  whenReady(cb){
    let interval    = 1500
    let checkready  = null
    checkready = setInterval(
      ()=>{
        if(this.isReady()){
          clearInterval(checkready)
          cb()
        }
      },interval
    )
  }

  setCurrentDirContent(content,cb){
    content.forEach(
      file=>{
        file.path = this.currentdir
        file.fullpath = `${this.currentdir}/${file.name}`
        this.currentdircontent.push(
          new this.core[file.type === 'd' ? 'FtipiFolder' : 'FtipiFile'](file) 
        )
      }
    )
    if(cb)cb(this.currentdircontent)
  }

  constructor(client){
    if(!client){
      return null
    }
    this.client = client
    this.core   = require(path.join(currentobjectspath,'core'))
    this.currentdir = null
    this.currentdircontent = []
    this.pwd(
      (currentdir)=>{
        this.currentdir = currentdir
        this.ready = 1
      }
    )
  }
}

module.exports = {
	ConnectionActions
}
