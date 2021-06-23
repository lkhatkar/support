class MessageDbo {
    constructor(dao) {
      this.dao = dao
    }
  
    createTable() {
      const sql = `
      CREATE TABLE IF NOT EXISTS Message (
        Sno        BIGSERIAL PRIMARY KEY,
        Subject TEXT,
        Creator_Id BIGINT NOT NULL
						REFERENCES Userdata (Sno) ON DELETE NO ACTION
                        ON UPDATE NO ACTION,   
		    Message_Body TEXT NOT NULL,
        Create_Date  DATE  NOT NULL,
        Parent_Message_Id BIGINT,
        Expiry_Date  DATE      
    )`
      return this.dao.run(sql)
    }

    getAll() {
      return this.dao.all(`SELECT * FROM Message`)
    }        

    get(id) {
      return this.dao.get(
        `SELECT * FROM Message WHERE Sno = $1`,
        [id])
    }

    create(Subject, Creator_Id, Message_Body, Create_Date, Parent_Message_Id, Expiry_Date) {
        return this.dao.run(
          'INSERT INTO Message (Subject, Creator_Id, Message_Body, Create_Date, Parent_Message_Id, Expiry_Date) VALUES ($1,$2,$3,$4,$5,$6)',
          [Subject, Creator_Id, Message_Body, Create_Date, Parent_Message_Id, Expiry_Date])
    }
    update(obj) {
        const {Sno, Subject, Creator_Id, Message_Body, Create_Date, Parent_Message_Id, Expiry_Date} = obj
        return this.dao.run(
            `UPDATE Message SET Subject = $1, Creator_Id = $2, Message_Body = $3, Create_Date = $4, Parent_Message_Id = $5, Expiry_Date = $6 WHERE Sno = $7`,
            [Subject, Creator_Id, Message_Body, Create_Date, Parent_Message_Id, Expiry_Date, Sno]
        )
    }
    delete(id) {
        return this.dao.run(
          `DELETE FROM Message WHERE Sno = $1`,
          [id]
        )
    }
  }
  
  module.exports = MessageDbo;