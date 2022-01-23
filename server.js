const express	=	require('express')
const http		=	require('http')
const sio		=	require('socket.io')
const path		=	require('path')
const app		=	new	express()
const server	=	http.createServer(app)
const io 		=	sio()
const port		=	process.env.PORT || 8000
const corepath	=	path.join(__dirname,'core/')
const viewspath	=	path.join(__dirname,'webserver/views')
const assetspath	=	path.join(__dirname,'webserver/assets')
const ftipi		=   new new require(path.join(corepath,'ftipi'))
const fs = require('fs')





//webserver

let rendertags = {}
function registerRenderTag(tag,src){
	rendertags[tag]={tag,src}
}
function getRenderTag(tag){
	return rendertags.hasOwnProperty(tag) ? rendertags[tag] : null
}
function applyRenderTag(rendertag,viewstr){
	return viewstr.replaceAll(rendertag.tag,rendertag.src)
}
function applyRenderTags(viewstr){

	Object.keys(rendertags).forEach(
		rendertag=>{
			viewstr = applyRenderTag(rendertags[rendertag],viewstr)
		}
	)
	return viewstr
}
function configureApp(app){
	app.use('/',express.static(path.join(assetspath)))
	app.use('/sio',express.static(path.join(__dirname,'node_modules/socket.io/client-dist/socket.io.min.js')))
	app.use('/socket.io.min.js.map',express.static(path.join(__dirname,'node_modules/socket.io/client-dist/socket.io.min.js.map')))
}

function startServer(cb=()=>{}){

	io.listen(server)

	io.on(
		'connection',(socket)=>{
			ftipi.newWebSocket(socket)
		}
	)

	
	function doRender(page){

		registerRenderTag(
			'{{#body}}',`
			${fs.readFileSync(path.join(viewspath,'topbar.html'))}
			${fs.readFileSync(path.join(viewspath,`${page}.html`))}
		`)
		
		registerRenderTag(
			'{{#registerserver}}',`
			${fs.readFileSync(path.join(viewspath,'registerserver.html'))}
		`)

		return applyRenderTags(fs.readFileSync(path.join(viewspath,'index.html')).toString())

	}


	configureApp(app)

	app.get(
		'/webcli.js',
		(req,res)=>{
			res.header(
				'Content-type','text/javascript'
			)
			res.send(
				ftipi.newWebCli()
			)
		}
	)

	app.get(
		'/webcliserver.js',
		(req,res)=>{
			res.header(
				'Content-type','text/javascript'
			)
			res.send(
				ftipi.newWebCliServer()
			)
		}
	)

	app.get(
		'/',(req,res)=>{
			res.send(doRender(
				'servers'
			))
		}

	)

	server.listen(port,serverStarted)

}

function serverStarted(errors) {
	if(errors){
		console.log(`errors running server on port ${port}`)
		return
	}
	console.log(`listening on port ${port}`) 

}


if(port)	startServer()


