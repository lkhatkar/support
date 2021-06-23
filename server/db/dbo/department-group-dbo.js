class DepartmentGroupDbo {
    constructor(dao) {
      this.dao = dao
    }
  
    createTable() {
      const sql = `
      CREATE TABLE IF NOT EXISTS Department_group (
        Sno        BIGSERIAL PRIMARY KEY,
        UserId    BIGINT NOT NULL
						REFERENCES User (Sno) ON DELETE NO ACTION
                        ON UPDATE NO ACTION,                  
        GroupId   BIGINT NOT NULL
						REFERENCES Department (Sno) ON DELETE NO ACTION
                        ON UPDATE NO ACTION, 
        Create_Date  DATE  NOT NULL,       
        IsActive  BOOLEAN NOT NULL DEFAULT (false)        
    )`
      return this.dao.run(sql)
    }

    getAll() {
      return this.dao.all(`SELECT * FROM Department_group`)
    }    

    get(id) {
      return this.dao.get(
        `SELECT * FROM Department_group WHERE Sno = $1`,
        [id])
    }

    create(UserId, GroupId, Create_Date, IsActive) {
        return this.dao.run(
          'INSERT INTO Department_group (UserId, GroupId, Create_Date, IsActive) VALUES ($1,$2,$3,$4)',
          [UserId, GroupId, Create_Date, IsActive])
    }
    update(obj) {
        const {Sno, UserId, GroupId, Create_Date, IsActive} = obj
        return this.dao.run(
            `UPDATE Department_group SET userId = $1, GroupId = $2, Create_Date = $3, IsActive = $4 WHERE Sno = $5`,
            [UserId, GroupId, Create_Date, IsActive, Sno]
        )
    }
    delete(id) {
        return this.dao.run(
          `DELETE FROM Department_group WHERE Sno = $1`,
          [id]
        )
    }
  }
  
  module.exports = DepartmentGroupDbo;