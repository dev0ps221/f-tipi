const express	=	require('express')
const http		=	require('http')
const sio		=	require('socket.io')
const path		=	require('path')
const app		=	new	express()
const server	=	http.createServer(app)
const io 		=	sio()


function startServer(cb=()=>{}){
	io.listen(server)
	io
}


