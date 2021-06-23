class DepartmentDbo {
    constructor(dao) {
      this.dao = dao
    }
  
    createTable() {
      const sql = `
      CREATE TABLE IF NOT EXISTS Department (
        Sno        BIGSERIAL PRIMARY KEY,        
        Name TEXT NOT NULL,                  
        Create_Date  DATE  NOT NULL,
        IsActive  BOOLEAN NOT NULL DEFAULT (false)                          
    )`
      return this.dao.run(sql)
    }

    getAll() {
      return this.dao.all(`SELECT * FROM Department`)
    }        

    get(id) {
      return this.dao.get(
        `SELECT * FROM Department WHERE Sno = $1`,
        [id])
    }

    create(Name, Create_Date, IsActive) {
        return this.dao.run(
          'INSERT INTO Department (Name, Create_Date, IsActive) VALUES ($1,$2,$3)',
          [Name, Create_Date, IsActive])
    }
    update(obj) {
        const {Sno, Name, Create_Date, IsActive} = obj
        return this.dao.run(
            `UPDATE Department SET Name = $1, Create_Date = $2, IsActive = $3 WHERE Sno = $4`,
            [Name, Create_Date, IsActive, Sno]
        )
    }
    delete(id) {
        return this.dao.run(
          `DELETE FROM Department WHERE Sno = $1`,
          [id]
        )
    }
  }
  
  module.exports = DepartmentDbo;