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
module.exports = FtipiWebCli