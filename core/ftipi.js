const path 				=	require('path')
const { FtipiFile } 	= require('./layers/one/two/objects/core')
const layerspath		=	path.join(__dirname,'layers/')
const {FtpConnexion,FtipiWebSocket,FtipiWebCli,FtipiWebCliServer}	= 	require(path.join(layerspath,'one/one'))
class FTeePee{

	registerServer({creds,name}){
		this.servers[name] = new FtpConnexion(creds,name)
			
		
		return this.servers[name]
	}

	getServer(name){
		
		return this.servers.hasOwnProperty(name) ? this.servers[name] : null
	
	}

	getConnectedServer(name){
		
		return this.connectedservers.hasOwnProperty(name) ? this.servers[name] : null
	
	}



	connectToServer(name,cb){
		const server = this.getServer(name)
		if(server){
			server.connect(
				(error)=>{
					if(!error){
						this.connectedservers[name]=server
					}
					if(cb)cb(error)
				}
			)
		}
	}

	getServers(){
		let ret = []
		Object.keys(this.servers).forEach(
			servername=>{
				ret.push(this.servers[servername].get())
			}
		)
		return ret
	}

	registerFunction(name,action){
		this.funcs[name] = action
	}	

	accessFunction(name,cb){
		return (this.funcs.hasOwnProperty(name)) ? this.funcs[name](cb)	:	null

	}

	newWebCli(){
		return FtipiWebCli.toString()
	}

	newWebCliServer(){
		return FtipiWebCliServer.toString()
	}

	newWebSocket(socket){
		
		this.websockets.push(new FtipiWebSocket(socket,this))
	}
	
	constructor(){
		this.funcs		=	{}
		this.servers 	=	{}
		this.connectedservers 	=	{}
		this.websockets = 	[]
	}

}

const ftipi = module.exports = FTeePee