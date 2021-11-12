const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { Dbo } = require('../db');
const middleware = require('../core/middleware');

// Routes
router.use('/token', async (req, res, next) => {

    let Client_Id = req.body.userid || req.body.client_id;
    let Client_Secret = req.body.password || req.body.client_secret;
    // let Client_Email = req.body.email;
    const UserDbo = new Dbo.User(global.dao);
    let validUser = false;
    let user, id;

    try {

        if (Client_Id && Client_Secret) {
            if (Client_Id === process.env.API_CLIENT_ID && Client_Secret === process.env.API_CLIENT_SECRET) {
                validUser = true;
                user = 'API';
            }
            else {
              let loginCredentials;
              if(Client_Id.includes('@'))
                loginCredentials = await UserDbo.getByEmail(Client_Id);
              else
                loginCredentials = await UserDbo.getByUserName(Client_Id);
                if ((loginCredentials.name == Client_Id || loginCredentials.email == Client_Id) && loginCredentials.password == Client_Secret) {
                    validUser = true;
                    user = {
                      name:loginCredentials.name,
                      email:loginCredentials.email,
                      id:loginCredentials.id
                    };
                    // organisation_id = loginCredentials.id;
                }
            }

            if (validUser) {
                let token = jwt.sign({ username: Client_Id },
                    process.env.API_SECRET,
                    {
                        expiresIn: '1h' // expires in 1 hours
                    }
                );
                // return the JWT token for the future API calls
                res.json({
                    success: true,
                    message: 'Authentication successful!',
                    user: user,
                    id: id,
                    access_token: token,
                    expires_in: 3600,
                    token_type: 'Bearer'
                });
            }
            else {
                res.status(401).send({
                    success: false,
                    message: 'Incorrect userID or password'
                });
            }
        }
        else {
            res.status(400).send({
                success: false,
                message: 'Authentication failed! Please check the request'
            });
        }

    } catch (error) {
        next(error)
    }

});

router.post('/login', async (req, res) => {
    const UserDbo = new Dbo.User(global.dao);
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    if (username && password) {
        const user = await UserDbo.getByEmail(email);
        if (user) {
            if (user.password === password) {
                res.status(200).send({ success: true });
            }
            else {
                res.status(200).send({ success: false, message: 'Wrong Password' });
            }
        }
        else {
            res.status(200).send({ success: false, message: 'User Not Found' });
        }
    }
    else {
        res.status(200).send({ success: false, message: 'invalid call' });
    }
});

router.get('/clients', middleware.checkToken, async (req, res, next) => {
    try {
        var clients = global.clients;
        if (clients) {
            clients = clients.map(({ ws, agent, ...rest }) => ({ ...rest }))
            res.status(200).send({ success: true, clients });
        }
        else {
            res.status(200).send({ success: false, message: "No Clients Found" });
        }
    }
    catch (e) {
        next(e);
    }
})

router.get('/agents', middleware.checkToken, async (req, res, next) => {
    try {
        const UserDbo = new Dbo.User(global.dao);
        const agents = await UserDbo.getAgents(global.dao)
        if (agents) {
            res.status(200).send({ success: true, agents });
        }
        else {
            res.status(200).send({ success: false, message: "No Agents Found" });
        }
    }
    catch (e) {
        next(e);
    }
})

router.get('/onlineAgents',middleware.checkToken, async (req, res, next) => {
  try{
    let globalAgents = global.agents;
    res.json({agents:globalAgents.map(({ ws, clients, ...rest }) => ({ ...rest }))});
  }
  catch (e) {
    next(e);
  }
})

router.post('/handleclient', middleware.checkToken, async (req, res, next) => {
    try {
        const agentEmail = req.body.email;
        const clientId = req.body.id;
        if (clientId && agentEmail) {
            let agentIndex = global.agents.findIndex(agent => agent.email == agentEmail);
            let clientIndex = global.clients.findIndex(client => client.id == clientId);
            if (agentIndex != -1 && clientIndex != -1) {
                global.clients[clientIndex]['agentName'] = global.agents[agentIndex]['name'];
                global.clients[clientIndex]['isAgentAssigned'] = true;
                var tempClient = [];
                tempClient.push(global.clients[clientIndex]);
                tempClient = tempClient.map(({ ws, agent, ...rest }) => ({ ...rest }));
                global.agents.forEach(element => {
                  if(element.ws.readyState == 1)
                    element.ws.send(JSON.stringify({type:'ClientConnect',clients:tempClient}));
                    // element.ws.send(JSON.stringify(tempClient));
                });
                global.agents[agentIndex].onHandleClient(global.clients[clientIndex]);
                res.status(200).send({ success: true });
            }
            else {
                res.status(200).send({ success: false, message: "Agent or Client Not Found" });
            }
        }
        else {
            res.status(200).send({ success: false, message: "Invalid Call" });
        }
    } catch (e) {
        next(e);
    }
})

//Agent Default Message Routes....
router.get('/initmessages/:agent', async(req,res,next)=>{
  try {
    const agent = req.params.agent;
    const initMessageDbo = new Dbo.initMessages(global.dao);
    const messages = await initMessageDbo.getAll();
    const agentMessages = messages.filter(mes=>mes.name === agent);
    if (messages) {
        res.status(200).send({ success: true, agentMessages });
    }
    else {
        res.status(200).send({ success: false, message: "No Messages Found" });
    }
}
catch (e) {
    next(e);
}
})

router.post('/initmessages', middleware.checkToken ,async(req,res,next)=>{
  try {
    const {name, message} = req.body;
    const initMessageDbo = new Dbo.initMessages(global.dao);
    const messages = await initMessageDbo.create(name, message);
    if (messages) {
        res.status(200).send({ success: true, messages:messages.rows[0]});
    }
    else {
        res.status(200).send({ success: false, message: "Failed to add message" });
    }
}
catch (e) {
    next(e);
}
})

router.delete('/initmessages/:id', middleware.checkToken ,async(req,res,next)=>{
  try {
    const id = req.params.id;
    const initMessageDbo = new Dbo.initMessages(global.dao);
    const messages = await initMessageDbo.delete(id);
    if (messages) {
        res.status(200).send({ success: true});
    }
    else {
        res.status(200).send({ success: false, message: "Failed to delete message" });
    }
}
catch (e) {
    next(e);
}
})

module.exports = router;
