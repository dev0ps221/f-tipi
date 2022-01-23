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
		serverview.classList.add('server')
		const head       = document.createElement('div')
		head.classList.add('server-head')
		const name       = document.createElement('h1')
		name.innerText   = `${this.name} at ${this.host}`
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
		connectbutton.classList.add('connectToServer')
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


	
    refreshContentViewBrowse(root){
		const browse = root.querySelector('#browse')
		
		
		const currentdir = browse.querySelector('#currentdir')
		currentdir.innerText = this.actualpath

		const contentlist = browse.querySelector("#browse-list")
		this.content.forEach(
			elem=>{
				contentlist.appendChild(this.buildContentListElem(elem))
			}
		)

    }

	buildContentListElem(data){
		const elem = document.createElement('li')
		elem.innerText = data.type
		return elem
	}

	updateContentView(){
		alert('lets update connected server view then')

		if(this.content){
			const connectedservers  = document.querySelector('#connected-servers')
			cli.refreshContentViewNav(connectedservers)
			this.refreshContentViewBrowse(connectedservers)

		}else{
			this.getContent()
		}
	}

	connect(event){
		cli.connectToServer(this)
	}

	isTheFocus(){
		const actual = cli.focusedConnection()
		return actual.name === this.name
	}

	contentLoop(){
		const contentinterval = 5000
		this.checkContent = setInterval(
			()=>{
				if(this.gotcontent){
					if(this.isTheFocus()){
						cli.refreshConnectedServersView()
					}
					this.gotcontent = false
				}
			},contentinterval
		)
	}

	setContent({content,dirpath}){
		this.content = content
		this.actualpath = dirpath
		this.gotcontent = true
	}
	
	getContent(){
		post(
			'/currentdirData',this.name
		)
	}

	constructor(data){
		this.data = data
		this.content = null
		this.gotcontent = false
		this.assignData(data)
		this.status
		this.contentLoop()
	}

}
module.exports = FtipiWebCliServer