const path = require('path')
const { clearInterval } = require('timers')
const currentpath = path.join(__dirname)
const FtipiFile   = require(path.join(currentpath,'/objects/file'))
const FtipiFolder = require(path.join(currentpath,'/objects/folder'))

const currentobjectspath = path.join(currentpath,'objects')



class ConnectionActions{


  async cwd(pth,cb,prom=null){
    return await this.client.cwd(pth,(...args)=>{
      this.currentdir = path.join(pth)
      this.updateContent(
        ()=>{
          cb(...args)
        }
      )
    },prom)
  }

  async upload(srcpath,srcname,cb){
    const tgtpath = `${this.currentdir}/${srcname}`
    console.log(tgtpath, ' as upload target')
    console.log(srcpath, ' as upload source')
    this.client.put(
      srcpath,tgtpath,cb
    )
  }

  async rename(srcpth,dstpth,cb){
    this.client.rename(
      srcpth,dstpth,cb
    )
  }

  async download(tgtpath,cb){
    this.client.get(
      tgtpath,cb
    )
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

  async updateContent(cb){
    this.whenReady(
      ()=>{
        this.list(
          this.currentdir,(e,data)=>{
            if(e) console.log(e)
            this.setCurrentDirContent(data,cb)
          }
        )
      }
    )
  }

  getContent(cb){
    this.updateContent(
      data=>{
        cb({content:data.map(elem=>elem.get()),dirpath:this.currentdir})
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
    this.currentdircontent = []
    if((typeof content) != undefined && content.length ) content.forEach(
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
    this.core   = {FtipiFile,FtipiFolder}
    this.currentdir = null
    this.currentdircontent = []
    this.pwd(
      (currentdir)=>{
        this.currentdir = currentdir
        this.ready = 1
        this.updateContent(
          ()=>{    

          }
        )

      }
    )
  }
}

module.exports = {
	ConnectionActions
}
