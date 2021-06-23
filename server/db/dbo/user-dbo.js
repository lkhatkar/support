class UserDbo {
    constructor(dao) {
      this.dao = dao
    }
  
    createTable() {
      const sql = `
      CREATE TABLE IF NOT EXISTS User (
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
      return this.dao.all(`SELECT * FROM User`)
    }        

    get(id) {
      return this.dao.get(
        `SELECT * FROM User WHERE Sno = $1`,
        [id])
    }

    create(Id, Name, Email, PageId, Create_Date, IsActive, Group_Id, Password, IsAgent) {
        return this.dao.run(
          'INSERT INTO User (Id, Name, Email, PageId, Create_Date, IsActive, Group_Id, Password, IsAgent) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
          [Id, Name, Email, PageId, Create_Date, IsActive, Group_Id, Password, IsAgent])
    }
    update(obj) {
        const {Sno, Id, Name, Email, PageId, Create_Date, IsActive, Group_Id, Password, IsAgent} = obj
        return this.dao.run(
            `UPDATE User SET Id = $1, Name = $2, Email = $3, PageId = $4, Create_Date = $5, IsActive = $6, Group_Id = $7, Password = $8, IsAgent = $9  WHERE Sno = $10`,
            [Id, Name, Email, PageId, Create_Date, IsActive, Group_Id, Password, IsAgent, Sno]
        )
    }
    delete(id) {
        return this.dao.run(
          `DELETE FROM User WHERE Sno = $1`,
          [id]
        )
    }
  }
  
  module.exports = UserDbo;