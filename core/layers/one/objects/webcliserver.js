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

	getFileExtension(name){
		let namearr = name.split('.')
		return namearr[namearr.length-1] 

	}

	buildContentListElem({type,infos}){
		const elem = document.createElement('li')
		const elemico = document.createElement('img')
		elemico.classList.add('typeico')
		let filetype = `${type.toLowerCase().replace('ftipi','')}`
		let fileextension = this.getFileExtension(infos.name)
		filetype = `${fileextension=='txt'?'text':''}${filetype}`
		filetype = `${fileextension=='sql'?'sql':''}${filetype}`
		filetype = `${fileextension=='php'?'php':''}${filetype}`
		filetype = `${fileextension=='png'?'png':''}${filetype}`
		filetype = `${fileextension=='jpeg'?'jpeg':''}${filetype}`
		filetype = `${fileextension=='jpg'?'jpg':''}${filetype}`
		filetype = `${fileextension=='gif'?'gif':''}${filetype}`
		filetype = `${fileextension=='ico'?'ico':''}${filetype}`
		filetype = `${fileextension=='avi'?'avi':''}${filetype}`
		filetype = `${fileextension=='mp4'?'mp4':''}${filetype}`
		filetype = `${fileextension=='mpeg4'?'mpeg4':''}${filetype}`
		filetype = `${fileextension=='3gp'?'3gp':''}${filetype}`
		filetype = `${fileextension=='html'?'html':''}${filetype}`
		filetype = `${fileextension=='mp3'?'mp3':''}${filetype}`
		filetype = `${fileextension=='wav'?'wav':''}${filetype}`
		filetype = `${fileextension=='ogg'?'ogg':''}${filetype}`
		filetype = `${fileextension=='rb'?'ruby':''}${filetype}`
		elemico.src = `/pics/${filetype}.ico`
		elem.appendChild(elemico)

		const name = document.createElement('span')
		name.classList.add('name')
		name.innerText = infos.name

		elem.appendChild(name)

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