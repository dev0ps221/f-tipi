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
function startServer(cb=()=>{}){
	io.listen(server)

	function doRender(page){

		return fs.readFileSync(path.join(viewspath,'index.html')).toString().replace(
			'#body',`
				${fs.readFileSync(path.join(viewspath,'topbar.html'))}
				${fs.readFileSync(path.join(viewspath,`${page}.html`))}
			`
		)

	}

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


