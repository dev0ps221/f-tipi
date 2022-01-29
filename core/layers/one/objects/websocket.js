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

						server.uploadFiles()

					})

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