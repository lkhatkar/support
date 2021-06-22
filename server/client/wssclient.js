class WssClient{
    constructor({url}){
        this.webSocket = new WebSocket(url);
        this.webSocket.onmessage = this._onMessage.bind(this);
        console.log(`Client Created`);
    }

    _onMessage(message){
        if(this.onMessage){
            this.onMessage(message);
        }
    }
    send(message){
        this.webSocket.send(message);
    }

}