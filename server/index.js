const path = require('path');
const { Dao, Dbo } = require('./db');
const fs = require('fs');
const filePath = path.join(__dirname, '.', 'config', 'config.json');
require('dotenv').config({
    path: path.resolve(__dirname, `./config/${process.env.ENV || 'prod'}.env`)
});

let initDatabse = async function(data)
{
    global.dao = new Dao({
        user: data.PGUSER,
        host: data.PGHOST,
        database: data.PGDATABASE,
        password: data.PGPASSWORD,
        port: data.PGPORT,
    });

    this.UserDbo = new Dbo.User(global.dao);
    this.MessagesDbo = new Dbo.Messages(global.dao);
    this.MessagesRecipientsDbo = new Dbo.MessagesRecipients(global.dao);
    this.DepartmentDbo = new Dbo.Department(global.dao);
    this.DepartmentGroupDbo = new Dbo.DepartmentGroup(global.dao);
    this.initMessagesDbo =  new Dbo.initMessages(global.dao);

    await this.UserDbo.createTable();
    await this.MessagesDbo.createTable();
    await this.MessagesRecipientsDbo.createTable();
    await this.DepartmentDbo.createTable();
    await this.DepartmentGroupDbo.createTable();
    await this.initMessagesDbo.createTable();
};

//immediately invoked function....
(()=>{
  try {
    if (fs.existsSync(filePath)) {
      let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      initDatabse(data);
    }
  } catch (e) {
    console.error(e);
  }
})();

module.exports = initDatabse;

// require('./core/server');
