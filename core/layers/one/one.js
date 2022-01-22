const connector	=	require('ftp')
const path = require('path')
const layerspath		=	path.join(__dirname)
const {ConnectionActions}	= 	require(path.join(layerspath,'two/two'))

class FtpConnexion{
	connect(){
		try{

			this.client.connect(this.c())

			this.client.on(
				'ready',
				()=>{this.connectionSuccess(this.client)}
			)
			this.client.on(
				'error',
				(e)=>{this.connectionError(e)}
			)

		}catch(error){
			this.connectionError(error)
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
		this.client	= null
		this.setupClient()
	}
}


class FtipiWebCli{

	


	setPage(page=null){
		let document = this.document
		this.actualpage=page?page:this.actualpage
	}

	handlePage(){

		if(this.actualpage == 'servers'){

			post(
				'/servers',null,(servers)=>{

					alert('servers')
					document.cookie = `servers=${JSON.stringify(servers)}`


				}
			)

			const registerserver = document.querySelector('#registerserver')
			const namefield = registerserver.querySelector('#name')
			const hostfield = registerserver.querySelector('#hostname')
			const userfield = registerserver.querySelector('#username')
			const passwordfield = registerserver.querySelector('#password')
			const addserver = registerserver.querySelector('#addserver')
			this.layout.newServerData = {
			}
			this.layout.updateNewServerData=()=>{
				const 
					name = namefield.value
					,host = hostfield.value
					,user = userfield.value
					,password = passwordfield.value

				this.layout.newServerData = {
					name,creds:{host,user,password}
				}
			}
			this.layout.newServer=()=>{
				this.layout.updateNewServerData()
				post(
					'addServer',this.layout.newServerData
				)
			}
			this.layout.updateNewServerData()
			addserver.addEventListener(
				'click',(e)=>{
					e.preventDefault()
					this.layout.newServer()
				}
			)
		}
	}

	constructor(window){
		this.layout = window
		this.document = this.layout.document
		this.actualpage = null
		this.setPage('home')
		this.handlePage()
	}
	
}


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
		return this.servers
	}

    constructor(socket,ftipi){
		console.log('new socket.io client connection')
		this.manager 	= ftipi
		this.socket 	= socket
		this.servers	= []
		this.configure()
	}
}
module.exports = {
	FtpConnexion,FtipiWebSocket,FtipiWebCli
}
