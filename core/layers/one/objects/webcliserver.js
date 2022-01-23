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
module.exports = FtipiWebCliServer