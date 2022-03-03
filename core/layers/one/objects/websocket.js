const fs = require('fs')
const FtipiWebCli = require("./webcli")
const path = require('path')
class FtipiWebSocket{

	configure(){

		this.socket.on(
			'/servers',()=>{
				this.emitServers()
			}
		)
		this.socket.on(
			'addServer',data=>{
				this.registerServer(data)
			}
		)
		this.socket.on(
			'connectToServer',name=>{
				this.connectToServer(name)
			}
		)
		this.socket.on(
			'fileupload',({name,files})=>{
				console.log('fileupload to ',name)

				const server = this.manager.getServer(name)
				if(server){
					
					server.saveListToTemp(files,()=>{
						console.log('files uploaded to temp')
						console.log('uploading to server')

						server.uploadFiles((e,r)=>{
							this.socket.emit(
								'fileuploadResults'
							)
						})

					})

				}else{

				}
			}
		)
		this.socket.on(
			'filerename'
			,({name,srcpath,tgtpath})=>{
				console.log('filerename',srcpath,' to ',tgtpath)
				const server = this.manager.getServer(name)
				if(server){
					server.rename(
						srcpath,dstpath,...args=>{
							console.log('rename results are ',args)
						}
					)
				}
			}
		
		)
		this.socket.on(
			'filedownload',({name,files})=>{
				console.log('fileupload to ',name)
				const server = this.manager.getServer(name)
				if(server){
					let fls =[]
					let errs =[]
					const final = ()=>{
						console.log('heyyy ',fls)
						if(errs.length){
							console.log('got some errors on downlad')
							errs.forEach(
								err=>{
									console.log(`for (${err[0]})\n`)
									console.log(`error is \n[\n\t${err[0]}\n]\n`)
								}
							)
						}
						fls.forEach(
							filepath=>{
								console.log('hey ',filepath)
								this.socket.emit(
									'filedownload',filepath
								)
							}
						)
					}
					files.forEach(
						(filepath,idx)=>{
							server.download(
								filepath,(err,stream)=>{
									let filename = `${filepath.split('/')[filepath.split('/').length-1]}`
									let filedownpath =  `${server.downloadPath}/${filename}`
									if(err){
										errs.push([filepath,`${filepath}`])
										if(idx+1 == files.length){
											final()
										}
										return 
									}
									stream.pipe(
										fs.createWriteStream(filedownpath)
									)
									stream.once(
										'close',()=>{
											fls.push(`ddsf/${filename}`)
											if(idx+1 == files.length){
												final()
											}
										}
									)
								}
							)

						}
					)
					console.log("let's download files ")
					console.log(files)
				}else{

				}
			}
		)
		this.socket.on(
			'/currentdirData',name=>{
				const server = this.manager.getServer(name)
				if(server){
					server.getContent(
						(data)=>{
							this.socket.emit(
								'/currentdirDataRes',data,name
							)
						}
					)
				}else{
					console.log('log missed the server ',name)
				}
			}
		)
		this.socket.on(
			'cd',({name,pathname})=>{
				console.log(`let's open ${pathname} on ${name}`)
				const server = this.manager.getServer(name)
				if(server){
					server.cd(
						pathname
						,()=>{
							server.getContent(
								(data)=>{
									this.socket.emit(
										'/currentdirDataRes',data,path.join(name)
									)
								}
							)
						}
					)
				}else{
					console.log('log missed the server ',name)
				}
			}
		)

	}

	connectToServer(name){
		const server = this.manager.getServer(name)
		if(server){
			this.manager.connectToServer(name,(e)=>{
				if(e)console.log(e)
				else{
					this.connectedservers[name] = server
					this.socket.emit(
						'serverConnected',name
					)
				}

			})
		}
	}

	emitServers(){
		this.socket.emit(
			'/serversRes',this.getServers()
		)
	}

	registerServer(data){
		this.servers.push(this.manager.registerServer(data))
		this.emitServers()
		return this.servers
	}

	getServers(){
		return this.servers.map(server=>server.get())
	}

    constructor(socket,ftipi){
		console.log('new socket.io client connection')
		this.manager 	= ftipi
		this.socket 	= socket
		this.servers	= []
		this.connectedservers	= {}
		this.configure()
	}
}
module.exports = FtipiWebSocket