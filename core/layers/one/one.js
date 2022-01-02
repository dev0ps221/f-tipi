class FtpConnexion{


	connect(){

	}

	disconnect(){

	}

	status(){

	}

	registerAction(name,action){
		this[name] = action
	}

	accessAction(name,cb){
		return this.hasOwnProperty(name)?this[name](cb):null
	}



	constructor(creds,name){
		this.c = creds
		this.n = name
	}
}