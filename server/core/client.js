class Client{
    constructor( id, name, email, dept, pid, ws, agent = false){
        this.id = id;
        this.name = name;
        this.email = email;
        this.dept = dept;
        this.pid = pid;
        this.ws = ws;
        
    }

    onMessage(message) {
        console.log('received: %s', message);
        if(this.ws.readyState == 1)
            this.ws.send(`Hello, you sent -> ${message}`);
    }

    assignAgent(agent){
        if(this.ws.readyState == 1)
            this.ws.send(JSON.stringify({success: true, message:"", name: agent.name}));
        
        this.agent = agent;
    }

    detachAgent() {
        if(this.ws.readyState == 1)
            this.ws.send(JSON.stringify({success: true, message: "Agent Disconnected"}));
            
        this.agent = null;
    }
}

module.exports = Client;
