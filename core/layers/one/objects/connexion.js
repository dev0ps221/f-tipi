const fs = require('fs')
const connector	=	require('ftp')
const path = require('path')
const layerspath		=	path.join(__dirname,'..')
const {ConnectionActions}	= 	require(path.join(layerspath,'two/two'))

class FtpConnexion{
	connect(cb){
		try{

			this.client.connect(this.c())

			this.client.on(
				'ready',
				()=>{
					this.connectionSuccess(this.client)
					if(cb)cb(null)		
				}
			)
			this.client.on(
				'error',
				(e)=>{
					this.connectionError(e)
					if(cb)cb(e)
				}
			)

		}catch(error){
			this.connectionError(error)
		}
	}
	cd(pth,cb){
		this.do(
			'cwd',pth,cb
		)
	}
	download(pth,cb){
		this.do(
			'download',pth,cb
		)
	}
	getContent(cb){
		this.do(
			'getContent',cb
		)
	}
	get(){
		const name = this.n
		,{host,user} = this.c()
		return {
			name,host,user
		}
	}
	setClientActions(){
		this.actions = new ConnectionActions(this.client)
		this.actions.whenReady(
			()=>{
				this.ready = 1
			}
		)
	}
	refreshCurrentDirContent(content,cb){
		this.do(
			'setCurrentDirContent',content,cb
		)
	}
	do(action,...args){
		if(!action || !typeof this.actions[action] === 'function'){
			return null
		}
		return this.actions[action](...args)
	}
	connectionSuccess(client){
		console.log('successfully connected to ',this.n)
		this.setClientActions()
		
	}
	connectionError(error){
		console.log('errors while connecting to the ftp server...',error)
	}
	disconnect(){
		try{
			this.client.close()
		}catch(e){
			console.log('errors while disconnecting from the ftp server...',e)
		}
	}
	status(){

	}
	registerAction(name,action=null){
		this[name] = action
	}
	accessAction(name,cb){
		return this.hasOwnProperty(name)?this[name](cb):null
	}

	setupClient(verbose=true){
		this.client 	= new connector()
	}



	isReady(){
		if(!this.hasOwnProperty('ready')) return
		return this.ready
	}
	
	saveTemp(file,cb){
		fs.writeFileSync(path.join(this.uploadPath,`${this.n}_${file.infos.name}`),file.data.rawdata)
		cb(path.join(this.uploadPath,`${this.n}_${file.infos.name}`))
	}

	saveListToTemp(list,cb){
		console.log('called ...')
		list.forEach(
			(file,idx)=>{
				console.log(`uploading ${file.infos.name} to temp dir`)
				this.saveTemp(file,(filepath)=>{
					console.log(` ${file.infos.name} saved as  ${filepath} `)
					if(idx+1 == list.length){
						cb()
					}
				})
			}
		)
	}

	uploadFiles(){
		const filelist = []
		const tmplist = fs.readdirSync(
			this.uploadPath
		)
		tmplist.forEach(
			elem=>{
				const [name,filename] = elem.split('_')
				const filepath = `${this.uploadPath}/${elem}`
				if(name==this.n)filelist.push(filepath)
			}
		) 
		console.log('upload temp list is',filelist)
		filelist.forEach(
			file=>{
				this.do(
					'upload',file,(err,list)=>{
						if(!err){
							console.log('uploaded file ',file)
							console.log('removing from temp')
							fs.unlinkSync(file)
							console.log('removed from temp')
							return
						}
						console.log('errors uploading file')
						console.log(err)
					}
				)
			}
		)
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

	constructor(creds,name){
		this.c 			= ()=>{return creds}
		this.n 			= name
		this.client		= null
		this.uploadPath = path.join(__dirname,'..','two','uptemp')
		this.downloadPath = path.join(__dirname,'..','two','downtemp')
		this.setupClient()
	}
}
module.exports = FtpConnexion