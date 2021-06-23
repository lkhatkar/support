class MessageRecipientDbo {
    constructor(dao) {
      this.dao = dao
    }
  
    createTable() {
      const sql = `
      CREATE TABLE IF NOT EXISTS Message_recipients (
        Sno        BIGSERIAL PRIMARY KEY,
        Recipients_Id    BIGINT NOT NULL
						REFERENCES User (Sno) ON DELETE NO ACTION
                        ON UPDATE NO ACTION,                  
        Recipients_Group_Id   BIGINT NOT NULL
						REFERENCES Department (Sno) ON DELETE NO ACTION
                        ON UPDATE NO ACTION, 
        Message_Id  BigInt  NOT NULL
                        REFERENCES Message (Sno) ON DELETE NO ACTION
                        ON UPDATE NO ACTION,       
        IsRead  BOOLEAN NOT NULL DEFAULT (false)        
    )`
      return this.dao.run(sql)
    }

    getAll() {
      return this.dao.all(`SELECT * FROM Message_recipients`)
    }    

    get(id) {
      return this.dao.get(
        `SELECT * FROM Message_recipients WHERE Sno = $1`,
        [id])
    }

    create(Recipients_Id, Recipients_Group_Id, Message_Id, IsRead) {
        return this.dao.run(
          'INSERT INTO Message_recipients (Recipients_Id, Recipients_Group_Id, Message_Id, IsRead) VALUES ($1,$2,$3,$4)',
          [Recipients_Id, Recipients_Group_Id, Message_Id, IsRead])
    }
    update(obj) {
        const {Sno, Recipients_Id, Recipients_Group_Id, Message_Id, IsRead} = obj
        return this.dao.run(
            `UPDATE Message_recipients SET Recipients_Id = $1, Recipients_Group_Id = $2, Message_Id = $3, IsRead = $4 WHERE Sno = $5`,
            [Recipients_Id, Recipients_Group_Id, Message_Id, IsRead, Sno]
        )
    }
    delete(id) {
        return this.dao.run(
          `DELETE FROM Message_recipients WHERE Sno = $1`,
          [id]
        )
    }
  }
  
  module.exports = MessageRecipientDbo;