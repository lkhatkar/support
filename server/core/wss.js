const WebSocket = require('ws');
const url = require('url');
const path = require('path');
const { nanoid } = require('nanoid')
const Client = require('./client');
const Agent = require('./agent');
const jwt = require('jsonwebtoken');
const { Dbo } = require('../db');

class Wss {
  constructor(app) {
    this.init(app);
  }
  init(server) {
    //initialize the WebSocket server instance
    const wss = new WebSocket.Server({ server });

    wss.on('connection', async (ws /*: WebSocket*/, req) => {

      const query = url.parse(req.url, true).query;

      //validation
      if (!query.name || !query.email || !query.dept || !query.pid) {
        if (ws.readyState == 1)
          ws.send(JSON.stringify({ error: "Please pass all parameters {name, email, dept, pid}" }));
        ws.close();
        return;
      };

      if (query.auth) {
        //validate auth
        jwt.verify(query.auth, process.env.API_SECRET, (err, decoded) => {
          if (err) {
            if (ws.readyState == 1)
              ws.send(JSON.stringify({ error: "Token is not valid" }));
            ws.close();
            return;
          } else {
            const agent = new Agent(query.id, query.name, query.email, query.dept, query.pid, ws);
            global.agents.push(agent);
            //Broadcasting Client List To All Agents when new agent is connected.
            if (global.clients.length > 0) {
              var clients = global.clients;
              clients = clients.map(({ ws, agent, ...rest }) => ({ ...rest }));
              if (agent.ws.readyState == 1)
                agent.ws.send(JSON.stringify({ type: 'ClientConnect', clients }));
            }
            global.agents.forEach(element => {
              if (element.ws.readyState == 1)
                element.ws.send(JSON.stringify({ type: 'ReloadAgents' }));
            })
          }
        });

      } else {
        const client = new Client(nanoid(6), query.name, query.email, query.dept, query.pid, ws);
        if(this.isClientInGlobal(client.email)) {
          client.ws.send(JSON.stringify({isClientActive: true}));
          return;
        }
        // Check for client in database
        let clientCheck = await this.addOrUpdateClient(client)
        if(!clientCheck) return; // Check for error here
        global.clients.push(client);
        //Broadcasting New Client To All Agents.
        var clients = global.clients;
        clients = clients.map(({ ws, agent, ...rest }) => ({ ...rest })).filter(cl => cl.id === client.id);
        if (global.agents.length > 0) {
          global.agents.forEach(element => {
            element.ws.send(JSON.stringify({ type: 'ClientConnect', clients }));
          });
          client.ws.send(JSON.stringify({ isAgentsAvailable: true }))
        } else {
          client.ws.send(JSON.stringify({ isAgentsAvailable: false }))
        }
      }

      ws.on('close', () => {
        var closedIndex = global.clients.findIndex(client => client.ws == ws);
        if (closedIndex != -1) {
          let closedClient = global.clients[closedIndex];
          this.addDisconnectedClients(closedClient);
          delete closedClient['ws'];
          delete closedClient['agent'];
          global.clients.splice(closedIndex, 1);
          //BroadCasting disconnected client to all Agents....
          if (global.agents.length > 0) {
            global.agents.forEach(element => {
              if (element.ws.readyState == 1)
                element.ws.send(JSON.stringify({ type: 'ClientDisconnect', closedClient }));
            })
          }
        }
        else {
          closedIndex = global.agents.findIndex(agent => agent.ws == ws);
          if (closedIndex != -1) {
            global.agents[closedIndex].detachClients();
            global.agents.splice(closedIndex, 1);

            //BroadCasting Agents Online/Offline status to all Agents....
            if (global.agents.length > 0) {
              global.agents.forEach(element => {
                if (element.ws.readyState == 1)
                  element.ws.send(JSON.stringify({ type: 'ReloadAgents' }));
              })
            }
          }
        }
      })

    });
  }

  addDisconnectedClients(client) {
    // console.log('disconnected: ',client);
  }

  isClientInGlobal(clientEmail){
    let flag = false;
    global.clients.forEach(element=>{
      if(element && element.email == clientEmail) {
        flag = true;
      }
    });
    return flag;
  }

  async addOrUpdateClient(client) {
    try {
      const UserDbo = new Dbo.User(global.dao);
      const user = await UserDbo.getClientByEmail(client.email);

      if(!user) {
        return await UserDbo.create(client.id, client.name, client.email, 'axy', new Date(), true, client.dept, null, false);
      }
      else {
        return await UserDbo.update(user.sno, client.id, client.name, client.email, 'axy', new Date(), true, client.dept, null, false);
      }
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Wss;
