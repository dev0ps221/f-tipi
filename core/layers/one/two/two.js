class ConnectionActions{


  async list(...args){
    return await this.client.list(...argss)
  }

  async ensureDir(pathname){
    return await this.client.ensureDir(pathname)
  }

  constructor(client){
    if(!client){
      return null
    }
    this.client = client

  }
}

module.exports = {
	ConnectionActions
}
