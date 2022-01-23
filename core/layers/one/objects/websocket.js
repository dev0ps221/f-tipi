const FtipiWebCli = require("./webcli")

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