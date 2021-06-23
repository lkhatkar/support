class UserDbo {
    constructor(dao) {
      this.dao = dao
    }
  
    createTable() {
      const sql = `
      CREATE TABLE IF NOT EXISTS userdata (
        Sno        BIGSERIAL PRIMARY KEY,
        Id         TEXT NOT NULL,
        Name TEXT  NOT NULL,
        Email TEXT  NOT NULL,
        PageId TEXT  NOT NULL,                  
        Create_Date  DATE  NOT NULL,
        IsActive  BOOLEAN NOT NULL DEFAULT (false),
        Group_Id BIGINT NOT NULL
                        REFERENCES Department (Sno) ON DELETE NO ACTION
                        ON UPDATE NO ACTION,
        Password TEXT,
        IsAgent BOOLEAN NOT NULL DEFAULT (false)        
    )`
      return this.dao.run(sql)
    }

    getAll() {
      return this.dao.all(`SELECT * FROM userdata`)
    }        

    get(id) {
      return this.dao.get(
        `SELECT * FROM userdata WHERE Sno = $1`,
        [id])
    }

    getByUserName(name) {
      return this.dao.get(
        `SELECT * FROM userdata WHERE Name = $1`,
        [name])
    }

    getAgents() {
      return this.dao.all(`SELECT * FROM userdata WHERE IsAgent = true`);
    }

    create(Id, Name, Email, PageId, Create_Date, IsActive, Group_Id, Password, IsAgent) {
        return this.dao.run(
          'INSERT INTO userdata (Id, Name, Email, PageId, Create_Date, IsActive, Group_Id, Password, IsAgent) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
          [Id, Name, Email, PageId, Create_Date, IsActive, Group_Id, Password, IsAgent])
    }
    update(obj) {
        const {Sno, Id, Name, Email, PageId, Create_Date, IsActive, Group_Id, Password, IsAgent} = obj
        return this.dao.run(
            `UPDATE userdata SET Id = $1, Name = $2, Email = $3, PageId = $4, Create_Date = $5, IsActive = $6, Group_Id = $7, Password = $8, IsAgent = $9  WHERE Sno = $10`,
            [Id, Name, Email, PageId, Create_Date, IsActive, Group_Id, Password, IsAgent, Sno]
        )
    }
    delete(id) {
        return this.dao.run(
          `DELETE FROM userdata WHERE Sno = $1`,
          [id]
        )
    }
  }
  
  module.exports = UserDbo;