const connector	=	require('basic-ftp')
const layerspath		=	path.join(__dirname)
const {ConnectionActions}	= 	require(path.join(layerspath,'two/two'))

class FtpConnexion{
	private actions;
	connect(connectErrorCallback=this.connectionError,connectSuccessCallback=this.connectionSuccess){
		try{

			this.client.access(
				this.creds
			)
			connectSuccessCallback()


		}catch(error){
			connectErrorCallback(error)
		}
	}
	setClientActions(){
		this.actions = new ConnectionActions(this.client)
	}
	do(action,...args){
		if(!action || !this.actions.hasOwnProperty(action)){
			return null
		}
		return this.actions[action](...args)
	}
	connectionSuccess(){
		this.setClientActions()
	}
	connectionError(error){
		console.log('errors while connecting to the ftp server...')
	}
	disconnect(){
		try{
			this.client.close
		}
	}
	status(){

	}
	registerAction(name,action){
		this[name] = action
	}
	accessAction(name,cb){
		return this.hasOwnProperty(name)?this[name](cb):null
	}

	setupClient(){
		this.client 					= connector.client()
		this.client.verbose		= true
	}

	constructor(creds,name){
		this.c 			= creds
		this.n 			= name
		this.client	= null
	}
}
module.exports = {
	FtpConnexion
}
