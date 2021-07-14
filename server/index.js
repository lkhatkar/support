const path = require('path');
const { Dao, Dbo } = require('./db');
// require('dotenv/config');
require('dotenv').config({
    path: path.resolve(__dirname, `./config/${process.env.ENV || 'prod'}.env`)
});

function initDb()
{
    global.dao = new Dao({
        user: process.env.PGUSER,
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD,
        port: process.env.PGPORT,
    });

    this.UserDbo = new Dbo.User(global.dao);
    this.MessagesDbo = new Dbo.Messages(global.dao);
    this.MessagesRecipientsDbo = new Dbo.MessagesRecipients(global.dao);
    this.DepartmentDbo = new Dbo.Department(global.dao);
    this.DepartmentGroupDbo = new Dbo.DepartmentGroup(global.dao);
    this.initMessagesDbo =  new Dbo.initMessages(global.dao);
}

initDb();

require('./core/server');
