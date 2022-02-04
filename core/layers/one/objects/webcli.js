const { get } = require("express/lib/response")

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

        this.connectedservers[server.name] = server

        this.refreshConnectedServersView()



    }

    focusedConnection(){
        const conlist = Object.keys(this.connectedservers)
        const conlistsize = conlist.length
        const connection = conlistsize
            ?   this.connectedservers[conlist[this.conIdx()]]
            :   null
		return connection
	}

    conIdx(){
        const conlist = Object.keys(this.connectedservers)
        const conlistsize = conlist.length
        this.connectedIdx = this.connectedIdx < 0 ? conlistsize-1 : this.connectedIdx
        return this.connectedIdx
    }

	refreshServersView(){
		const serversview  = document.querySelector('#servers .list')
		const label = document.createElement('h1')
		label.classList.add('list-label')
		label.innerText = 'servers'
		serversview.innerHTML = "" 
		// serversview.appendChild(label)
		this.servers.forEach(
			server=>{
				serversview.appendChild(
					server.buildWebView()
				)
			}
		)
	}


    refreshContentViewNav(root){
        const nav = root.querySelector('#nav')
		
    }

	refreshConnectedServersView(){
        const actualserver = this.focusedConnection()
		const connectedservers  = document.querySelector('#connected-servers')
		this.refreshContentViewNav(connectedservers)
		if(actualserver){
			actualserver.updateContentView()
        }
	}

	handlePage(){

		if(this.actualpage == 'servers'){

			get(
				'serverConnected',name=>{
					this.serverConnected(this.getServerByName(name))
				}
			)

			get(
				'/currentdirDataRes',(data,name)=>{
					this.getServerByName(name).setContent(data)
				}
			)

			get(
				'filedownload',tgt=>{
					window.open(tgt)
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
        this.connectedservers = {}
        this.connectedIdx = -1
		this.setPage('home')
		this.handlePage()
	}
	
}
module.exports = FtipiWebCli