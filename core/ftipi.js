const path 				=	require('path')
const layerspath		=	path.join(__dirname,'layers/')
const {FtpConnexion}	= 	require(path.join(layerspath,'one/one'))
class FTeePee{

	registerServer({creds,name}){
		this.servers.push(
			
			new FtpConnexion(creds,name)
			
		)

	}
	registerFunction(name,action){
		this.funcs[name] = action
	}	
	accessFunction(name,cb){
		return (this.funcs.hasOwnProperty(name)) ? this.funcs[name](cb)	:	null

	}
	constructor(){
		this.funcs		=	{}
		this.servers 	=	[]
	}

}

const ftipi = module.exports = FTeePee