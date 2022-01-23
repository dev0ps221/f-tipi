function buildServerView(server){
    
    const serverview = document.createElement('div')
    const head       = document.createElement('div')
    const name       = document.createElement('h1')
    name.innerText   = `${server.name} at ${server.host}`
    head.classList.add('server-head')
    const infos       = document.createElement('div')
    infos.classList.add('server-infos')
    const username  = document.createElement('div')
    username.innerText = `username :: ${server.user}`
    infos.appendChild(username)
    const hostname  = document.createElement('div')
    hostname.innerText = `hostname :: ${server.host}`
    infos.appendChild(hostname)
    const foot       = document.createElement('div')
    const connectbutton = document.createElement('button')
    connectbutton.innerText = 'connect'
    foot.appendChild(connectbutton)
    connectbutton.addEventListener(
        'click'
        ,(e)=>cli.connectToServer(e,server)
    )
    foot.classList.add('server-foot')
    
    head.appendChild(name)

    serverview.appendChild(head)
    serverview.appendChild(infos)
    serverview.appendChild(foot)
    return serverview

}

function refreshServersView(servers){
    const serversview  = document.querySelector('#servers .list')
    serversview.innerHTML = "" 
    servers.forEach(
        server=>{
            serversview.appendChild(
                buildServerView(server)
            )
        }
    )
}
cli.setPage(
    'servers'
)
cli.handlePage()