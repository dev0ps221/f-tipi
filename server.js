const express	=	require('express')
const http		=	require('http')
const sio		=	require('socket.io')
const path		=	require('path')
const app		=	new	express()
const server	=	http.createServer(app)
const io 		=	sio()
const port		=	process.env.PORT || 8000
const corepath	=	path.join(__dirname,'core/')
const homecreds =   require('./homecreds')
const ftipi		=   new new require(path.join(corepath,'ftipi'))


ftipi.registerServer({creds:homecreds,name:"Home"})

//this is a test
let homeserver = ftipi.servers[0] 
homeserver.connect()
homeserver.whenReady(
	()=>{
		console.log('home is ready')
		let run = (homeserver.do(
			'list'
			,(error,content)=>{
				homeserver.do(
					'pwd',(workingdir)=>{
						console.log('data on ',workingdir)
						console.log('errors ',error)
						homeserver.refreshCurrentDirContent(content,(dircontent)=>{
							console.log(dircontent)
						})
					}
				)
			}
		))
		console.log('ran == ',run)
	}
)
//this is a test

function startServer(cb=()=>{}){
	io.listen(server)



	server.listen(port,serverStarted)
}

function serverStarted(errors) {
	if(errors){
		console.log(`errors running server on port ${port}`)
		return
	}
	console.log(`listening on port ${port}`) //good, nioungui baax

}





if(port)	startServer()


