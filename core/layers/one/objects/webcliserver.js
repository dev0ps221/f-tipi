class FtipiWebCliServer{

	assignData(data){
		Object.keys(data).forEach(
			prop=>{
				this[prop] = data[prop]
			}
		)
	}



	cd(pathname){

		const actualserver = cli.focusedConnection()
		if(actualserver){
			const {name} = actualserver
			post(
				'cd',{name,pathname}
			)
		}else{
			console.warn("lost actual server")
		}

	}
	
	download(pathname){

		const actualserver = cli.focusedConnection()
		if(actualserver){
			const {name} = actualserver
			const files = [pathname]
			post(
				'filedownload',{name,files}
			)
		}else{
			console.warn("lost actual server")
		}

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
		const uploadfile = document.createElement('input')
		uploadfile.type = 'file'
		uploadfile.multiple = 1
		
		const currentdir = browse.querySelector('#currentdir')
		currentdir.innerText = this.actualpath

		let  uploadbutton = null

		browse.querySelectorAll('button').forEach(
			button=>{
				if(button.innerText==='upload') uploadbutton = button
			}
		
		)
		
		if(uploadbutton)uploadbutton.disabled = 0

		const contentlist = browse.querySelector("#browse-list")
		contentlist.innerText = ""
		this.content.forEach(
			elem=>{
				contentlist.appendChild(this.buildContentListElem(elem))
			}
		)

		uploadbutton.addEventListener(
			'click',e=>{
				uploadfile.click()
			}
		)
		uploadfile.addEventListener(
			'change',this.uploadFileChange
		)
		
		
    }
	uploadFileChange(e){
		alert('lets upload some files to the server')
		const loadDone=(uploaddata)=>{
			alert('loading data done ..\nready for upload')
			console.log("uploaddata is ",uploaddata)
			const actualserver = cli.servers[cli.connectedIdx]
			if(actualserver){
				post(
					'fileupload',{name:actualserver.name,files:uploaddata}
				)
			}
		}


		function parseFileData(dataUrl){
			const parts = dataUrl.split(",")
			const datainfos = parts[0].replace('data:','').split(';')
			const [fileinfos,filencoding] = datainfos
			const rawdata  = parts[1]
			const [filetype,fileextension] = fileinfos.split('/')
			return {
				rawdata,filetype,fileextension,filencoding
			}
		}

		Array.from(e.target.files).forEach(
			(file,idx)=>{
				let r = new FileReader()
				let uploaddata = []
				r.addEventListener('progress', (event) => {
					if (event.loaded && event.total) {
					const percent = (event.loaded / event.total) * 100;
					console.log(`Progress: ${Math.round(percent)}%`);
					}
				})

				r.addEventListener(
					'load',ev=>{
						uploaddata.push({infos:{name:file.name,size:file.size,lastModified:file.lastModified},data:parseFileData(r.result)})
						if(idx+1==e.target.files.length){
							loadDone(uploaddata)
						}
					}
				)
				r.readAsDataURL(file)
			}
		)
		console.log(e.target.files)
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
		const elemactions = document.createElement('div')
		elemactions.classList.add('actions')
		const content = document.createElement('span')
		content.classList.add('content')
		content.innerText = infos.name
		
		content.addEventListener(
			'click',
			e=>{
				if(e.target.className!='action'){
					elem.classList[(elem.classList.contains('selected'))?'remove':'add']('selected')
				}
			}
		)
			
		content.appendChild(elemactions)
		elemheading.appendChild(content)
		
		
		const actionlist = []

		const open = document.createElement('button')
		open.classList.add('action')
		open.innerText = 'open'
		actionlist.push(open)

		const download = document.createElement('button')
		download.classList.add('action')
		download.innerText = 'download'
		actionlist.push(download)
		actionlist.forEach(
			action=>{
				action.addEventListener(
					'click',e=>{
						e.preventDefault()
						if(action.innerText == 'open'){
							this.cd(infos.fullpath)
						}
						if(action.innerText == 'download'){
							this.download(infos.fullpath)
						}
					}
				)
				elemactions.appendChild(action)

			}
		)
		
		

		elem.appendChild(elemheading)
		// content.appendChild(infs)
		
		return elem
	}
	
	updateContentView(){
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