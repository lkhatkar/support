const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const url = require('url');
const path = require('path');
const { nanoid } = require('nanoid')
const Client = require('./client');
const Agent = require('./agent');

const app = express();

const clients = [];
const agents = [];

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws /*: WebSocket*/, req) => {

    const query = url.parse(req.url, true).query;

    //validation
    if( !query.name
        || !query.email
        || !query.dept
        || !query.pid
        ){
            ws.send(JSON.stringify({error: "Please pass all parameters {name, email, dept, pid}"}));
            ws.close();
            return;
        };
    
    
    if(query.auth){
        //validate auth
        const agent = new Agent(nanoid(6), query.name, query.email, query.dept,  query.pid, ws);
        agents.push(agent);
    }else{
        
        const client = new Client(nanoid(6), query.name, query.email, query.dept,  query.pid, ws);
        clients.push(client);
    }

    if(agents.length > 0 && clients.length > 0){
        agents[0].onHandleClient(clients[0]);
    }
    
});

//start our server
server.listen(process.env.PORT || 80, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});