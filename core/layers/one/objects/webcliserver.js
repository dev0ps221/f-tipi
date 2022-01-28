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
		const filetypes = this.filetypes
		const elem = document.createElement('li')
		const elemheading = document.createElement('div')
		elemheading.classList.add('elemheading')
		const elemico = document.createElement('img')
		elemico.classList.add('typeico')
		let filetype = `${type.toLowerCase().replace('ftipi','')}`
		let fileextension = this.getFileExtension(infos.name)
		Object.keys(filetypes).forEach(
			ext=>{
				filetype = `${fileextension==ext?filetypes[ext]:''}${filetype}`
			}
		)
		elemico.src = `/pics/${filetype}.ico`
		elemheading.appendChild(elemico)

		const name = document.createElement('span')
		name.classList.add('name')
		name.innerText = infos.name
		
		name.addEventListener(
			'click',
			e=>{
				elem.classList[(elem.classList.contains('selected'))?'remove':'add']('selected')
			}
		)

		const infs = document.createElement('div')
		infs.classList.add('inf')
		Object.keys(infos).forEach(
			info=>{

				const infobox = document.createElement('span')
				const infoboxlabel = document.createElement('span')
				const infoboxdata  = document.createElement('span')

				infoboxlabel.classList.add('infolabel')
				infoboxlabel.innerText = info
				
				infoboxdata.classList.add('infodata')
				infoboxdata.innerText = infos[info]
				

				infobox.appendChild(infoboxlabel)
				infobox.appendChild(infoboxdata)

				infs.appendChild(infobox)

			}
		)
		
		elemheading.appendChild(name)
		elem.appendChild(elemheading)
		elem.appendChild(infs)
		
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

	setFileTypes(){

		this.filetypes = {
			'txt':'text'
			,'sql':'sql'
			,'php':'php'
			,'png':'png'
			,'jpeg':'jpeg'
			,'jpg':'jpg'
			,'gif':'gif'
			,'ico':'ico'
			,'avi':'avi'
			,'mp4':'mp4'
			,'mpeg4':'mpeg4'
			,'3gp':'3gp'
			,'html':'html'
			,'mp3':'mp3'
			,'wav':'wav'
			,'ogg':'ogg'
			,'rb':'ruby'
		}
	
	}

	constructor(data){
		this.setFileTypes()
		this.data = data
		this.content = null
		this.gotcontent = false
		this.assignData(data)
		this.status
		this.contentLoop()
	}

}
module.exports = FtipiWebCliServer