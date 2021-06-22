class Client{
    constructor({url}){
        this.webSocket = new WebSocket(url);
        console.log(`Client Created`);
    }

}