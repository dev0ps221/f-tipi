cli.setPage(
    'servers'
)
post(
    '/servers',null,(servers)=>{


        document.cookie = `servers=${JSON.stringify(servers)}`


    }
)