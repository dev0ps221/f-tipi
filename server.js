const express	=	require('express')
const http		=	require('http')
const sio		=	require('socket.io')
const path		=	require('path')
const app		=	new	express()
const server	=	http.createServer(app)
const io 		=	sio()
const port		=	process.env.PORT || 8000
const corepath	=	path.join(__dirname,'core/')
const ftipi		=   new new require(path.join(corepath,'ftipi'))

//webserver
function startServer(cb=()=>{}){
	io.listen(server)



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


