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
                    if(ws.readyState==1)
                        ws.send(JSON.stringify({error: "Please pass all parameters {name, email, dept, pid}"}));
                    ws.close();
                    return;
                };


            if(query.auth){
                //validate auth
                //validate auth
                jwt.verify(query.auth, process.env.API_SECRET, (err, decoded) => {
                    if (err) {
                        if(ws.readyState == 1)
                            ws.send(JSON.stringify({error: "Token is not valid"}));
                        ws.close();
                        return;
                    } else {
                        const agent = new Agent(nanoid(6), query.name, query.email, query.dept,  query.pid, ws);
                        global.agents.push(agent);

                        //Broadcasting Client List To All Agents when new agent is connected.
                        if(global.clients.length > 0){
                          var clients = global.clients;
                          clients = clients.map(({ ws, agent, ...rest }) => ({ ...rest }));
                          
                          if(agent.ws.readyState==1)
                            agent.ws.send(JSON.stringify(clients));
                        }
                        global.agents.forEach(element=>{
                            if(element.ws.readyState == 1)
                                element.ws.send(JSON.stringify({refreshAgents:true}));
                        })
                    }
                });

            }else{
                const client = new Client(nanoid(6), query.name, query.email, query.dept,  query.pid, ws);
                global.clients.push(client);
                //Broadcasting Client List To All Agents when new client is connected.
                var clients = global.clients;
                clients = clients.map(({ ws, agent, ...rest }) => ({ ...rest })).filter(cl=>cl.id === client.id)
                if(global.agents.length > 0){
                  global.agents.forEach(element => {
                    element.ws.send(JSON.stringify(clients))
                  });
                  client.ws.send(JSON.stringify({isAgentsAvailable:true}))
                }else{
                  client.ws.send(JSON.stringify({isAgentsAvailable:false}))
                }
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
                        global.agents[closedIndex].detachClients();
                        global.agents.splice(closedIndex, 1);

                        global.agents.forEach(element=>{
                            if(element.ws.readyState==1)
                                element.ws.send(JSON.stringify({refreshAgents:true}));
                        })
                    }
                }
            })

        });
    }
}

module.exports = Wss;
