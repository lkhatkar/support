require('./global');
const express = require('express');
const http = require('http');
const Wss = require('./wss');
const routes = require('./routes');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors());
app.use(function(req, res, next) {
    res.sendData = function(obj) {
      if (req.accepts('json') || req.accepts('text/html')) {
        res.header('Content-Type', 'application/json');
        res.send(obj);
      } else {
        res.send(406);
      }
    };

    next();
  });

app.use('/agent', express.static(path.join(__dirname, '../agent/')));
app.use('/client', express.static(path.join(__dirname, '../client/')));
app.use('/api', routes);

//initialize a simple http server
const server = http.createServer(app);
const wsserver = new Wss(server);


//start our server
server.listen(process.env.PORT || 80, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});
