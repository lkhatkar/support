class Client{
    constructor( id, name, email, dept, pid, ws){
        this.id = id;
        this.name = name;
        this.email = email;
        this.dept = dept;
        this.pid = pid;
        this.ws = ws;

        // this.ws.on('message', this.onMessage.bind(this))
        this.ws.send(JSON.stringify({success: true, message: `Welcome ${this.name}`}));
    }

    onMessage(message) {
        console.log('received: %s', message);
        this.ws.send(`Hello, you sent -> ${message}`);
    }

    assignAgent(agent){
        this.agent = agent;
    }
}

module.exports = Client;