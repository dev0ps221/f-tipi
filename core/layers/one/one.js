const connector	=	require('ftp')
const path = require('path')
const layerspath		=	path.join(__dirname)
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

class FtipiWebCliServer{

	assignData(data){
		Object.keys(data).forEach(
			prop=>{
				this[prop] = data[prop]
			}
		)
	}

	buildWebView(){
    
		const serverview = document.createElement('div')
		const head       = document.createElement('div')
		const name       = document.createElement('h1')
		name.innerText   = `${this.name} at ${this.host}`
		head.classList.add('server-head')
		const infos       = document.createElement('div')
		infos.classList.add('server-infos')
		const username  = document.createElement('div')
		username.innerText = `username :: ${this.user}`
		infos.appendChild(username)
		const hostname  = document.createElement('div')
		hostname.innerText = `hostname :: ${this.host}`
		infos.appendChild(hostname)
		const foot       = document.createElement('div')
		const connectbutton = document.createElement('button')
		connectbutton.innerText = 'connect'
		foot.appendChild(connectbutton)
		connectbutton.addEventListener(
			'click'
			,(e)=>this.connect(e)
		)
		foot.classList.add('server-foot')
		
		head.appendChild(name)
	
		serverview.appendChild(head)
		serverview.appendChild(infos)
		serverview.appendChild(foot)
		
		return serverview
	
	}

	updateView(){
		alert('lets update connected server view then')
		console.log(this)
	}

	connect(event){
		cli.connectToServer(this)
	}

	constructor(data){
		this.data = data
		this.assignData(data)
		this.status
	}

}

class FtipiWebCli{

	


	setPage(page=null){
		let document = this.document
		this.actualpage=page?page:this.actualpage
	}

	connectToServer(server){
		post(
			'connectToServer',server.name
		)
	}

	serverConnected(server){
		alert('successfully connected to '+server.name)
		this.getServer(server).updateView()
	}


	refreshServersView(){
		const serversview  = document.querySelector('#servers .list')
		serversview.innerHTML = "" 
		this.servers.forEach(
			server=>{
				serversview.appendChild(
					server.buildWebView()
				)
			}
		)
	}

	handlePage(){

		if(this.actualpage == 'servers'){

			get(
				'serverConnected',name=>{
					this.serverConnected(this.getServerByName(name))
				}
			)

			post(
				'/servers',null,(servers)=>{


					document.cookie = `servers=${JSON.stringify(servers)}`
					this.updateServers()
					this.refreshServersView()

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

	getServerByName(name){
		let server = null
		this.servers.forEach(
			serv=>{
				if(serv.name === name)server = serv
			}
		)
		return server
	}

	updateServers(){
		this.servers = JSON.parse(COOKIES()['servers']).map(
			server=>{
				return new FtipiWebCliServer(server)
			}
		)
		console.log('updated servers')
		console.log(this.servers)
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
module.exports = {
	FtpConnexion,FtipiWebSocket,FtipiWebCli,FtipiWebCliServer
}
