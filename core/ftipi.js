const path 				=	require('path')
const layerspath		=	path.join(__dirname,'layers/')
const {FtpConnexion}	= 	require(path.join(layerspath,'one/one'))
class FTeePee{

	registerServer({creds,name}){
		this.servers[name] = new FtpConnexion(creds,name)
			
		

	}

	getServer(name){
		
		return this.servers.hasOwnProperty(name) ? this.servers[name] : null
	
	}

	getServers(){
		let ret = []
		Object.keys(this.servers).forEach(
			servername=>{
				ret.push(this.servers[servername])
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
	
	constructor(){
		this.funcs		=	{}
		this.servers 	=	{}
	}

}

const ftipi = module.exports = FTeePee