const Client = require('./client');
const { Dbo } = require('../db');
class Agent extends Client{

    clients = [];

    constructor( id, name, email, dept, pid, ws){
        super(id, name, email, dept, pid, ws, true);
        this.ws.on('message', this.onAgentMessage.bind(this));
    }

    onAgentMessage(jsonString) {
        try {
            let {clientId, message, isAgentTyping} = JSON.parse(jsonString);
            let client = this.clients.find(c => c.id == clientId);
            if(client){
                if(client.ws.readyState == 1){
                  if(isAgentTyping){
                    client.ws.send(JSON.stringify({success: true, message, name: this.name, isAgentTyping}));
                  }else{
                    client.ws.send(JSON.stringify({success: true, message, name: this.name, isAgentTyping = false}));
                    saveMessagesToDB(this.email, client.email, message, null, 0);
                  }
                }
            }
        }
        catch(e) {
            console.error("On Agent Message", e);
        }
    }

    onClientMessage(message){
        try {
        //this will refer to client
            // this.agent.ws.send(message);
            if(this.agent.ws.readyState == 1){
              if(message === 'isClientTyping'){
                this.agent.ws.send(JSON.stringify({type:'ClientTyping', id: this.id}));
              }else{
                this.agent.ws.send(JSON.stringify({type:'ClientMessage', id: this.id, message}));
                saveMessagesToDB(this.email, this.agent.email, message, null, 0);
              }
            }
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

    detachClients() {
        this.clients.forEach(function (client) {
            client.detachAgent();
        });
        this.clients = [];
    }

    // saveMessagesToDB(agentId, clientId, message, isAgent = false){
    //   console.log(message);
    // }

}

async function saveMessagesToDB(from, to, message, attachment, isRead, isDeleted = false){
  try{
    const MessageDbo = new Dbo.Messages(global.dao);
    return await MessageDbo.create(from, message, new Date(), null, to, attachment, isRead, isDeleted);
  } catch(error){
    console.error(error);
  }
}

module.exports = Agent;


//a->s->c
//c->s->a
//a->c xxx
//c->a xxx
