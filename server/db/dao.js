// dao.js
const { Client } = require('pg');

class AppDAO {
  constructor(dbFilePath) {
    this.db = new Client(dbFilePath);
    this.db.connect((err) => {
      if (err) {
        console.log('Could not connect to database', err)
      } else {
        console.log('Connected to database')
      }
    })
  }
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.query(sql, params, function (err, result) {
        if (err) {
          console.log('Error running sql ' + sql)
          console.log(err)
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.query(sql, params, (err, result) => {
        if (err) {
          console.log('Error running sql: ' + sql)
          console.log(err)
          reject(err)
        } else {
          resolve(result.rows[0])
        }
      })
    })
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.query(sql, params, (err, result) => {
        if (err) {
          console.log('Error running sql: ' + sql)
          console.log(err)
          reject(err)
        } else {
          resolve(result.rows)
        }
      })
    })
  }

  end() {
    this.db.end();
  }
}

module.exports = AppDAO