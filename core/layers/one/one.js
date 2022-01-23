const path =  require('path')
const layerspath		=	path.join(__dirname)

module.exports = {
	FtpConnexion : require(path.join(layerspath,'objects/connexion'))
	,FtipiWebSocket : require(path.join(layerspath,'objects/websocket'))
	,FtipiWebCli : require(path.join(layerspath,'objects/webcli'))
	,FtipiWebCliServer : require(path.join(layerspath,'objects/webcliserver'))
}
