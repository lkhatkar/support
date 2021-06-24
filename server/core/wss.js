const WebSocket = require('ws');
const url = require('url');
const path = require('path');
const { nanoid } = require('nanoid')
const Client = require('./client');
const Agent = require('./agent');
const jwt = require('jsonwebtoken');

class Wss{
    constructor(app){
        this.init(app);
    }
    init(server){
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
                //validate auth
                jwt.verify(query.auth, process.env.API_SECRET, (err, decoded) => {
                    if (err) {
                        ws.send(JSON.stringify({error: "Token is not valid"}));
                        ws.close();
                        return;
                    } else {
                        const agent = new Agent(nanoid(6), query.name, query.email, query.dept,  query.pid, ws);
                        global.agents.push(agent);
                    }
                });

            }else{

                const client = new Client(nanoid(6), query.name, query.email, query.dept,  query.pid, ws);
                global.clients.push(client);
            }

            /*if(agents.length > 0 && clients.length > 0){
                agents[0].onHandleClient(clients[0]);
            }*/

            ws.on('close', () => {
                var closedIndex = global.clients.findIndex(client => client.ws == ws);
                if(closedIndex != -1) {
                    global.clients.splice(closedIndex, 1);
                }
                else {
                    closedIndex = global.agents.findIndex(agent => agent.ws == ws);
                    if(closedIndex != -1) {
                        global.agents.splice(closedIndex, 1);
                    }
                }
            })

        });
    }
}

module.exports = Wss;
