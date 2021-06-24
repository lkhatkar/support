const Client = require('./client');
class Agent extends Client{

    clients = [];

    constructor( id, name, email, dept, pid, ws){
        super(id, name, email, dept, pid, ws, true);
        this.ws.on('message', this.onAgentMessage.bind(this));
    }

    onAgentMessage(jsonString) {
        let {clientId, message} = JSON.parse(JSON.parse(jsonString));
        let client = this.clients.find(c => c.id == clientId);
        if(client){
            client.ws.send(message);
        }
    }

    onClientMessage(message){
        //this will refer to client
        this.agent.ws.send(message);
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