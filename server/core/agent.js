const Client = require('./client');
class Agent extends Client{

    clients = [];

    constructor( id, name, email, dept, pid, ws){
        super(id, name, email, dept, pid, ws, true);
        this.ws.on('message', this.onAgentMessage.bind(this));
    }

    onAgentMessage(jsonString) {
        try {
            let {clientId, message} = JSON.parse(jsonString);
            let client = this.clients.find(c => c.id == clientId);
            if(client){
                client.ws.send(jsonString);
            }
        }
        catch(e) {
            console.error("On Agent Message", e);
        }
    }

    onClientMessage(message){
        try {
        //this will refer to client
            this.agent.ws.send(message);
        }
        catch(e) {
            console.error("On Client Message", e);
        } 
    }

    onHandleClient(client){
        client.ws.on('message', this.onClientMessage.bind(client));
        this.clients.push(client);
        client.assignAgent(this);
    }
}

module.exports = Agent;


//a->s->c
//c->s->a
//a->c xxx
//c->a xxx