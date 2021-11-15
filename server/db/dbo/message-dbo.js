class MessageDbo {
    constructor(dao) {
      this.dao = dao
    }

    createTable() {
      const sql = `
      CREATE TABLE IF NOT EXISTS Message (
        Sno        BIGSERIAL PRIMARY KEY,
        From TEXT NOT NULL
            REFERENCES Userdata (id) ON DELETE NO ACTION
        ON UPDATE NO ACTION,
        to BIGINT NOT NULL
						REFERENCES Userdata (email) ON DELETE NO ACTION
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

    create(From, Message_Body, Create_Date, Parent_Message_Id, To, Attachment, Is_Read, Is_Deleted) {
        return this.dao.run(
          'INSERT INTO Message ("from", Message_Body, Create_Date, Parent_Message_Id, "to", Attachment, Is_Read, Is_Deleted) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
          [ From, Message_Body, Create_Date, Parent_Message_Id, To, Attachment, Is_Read, Is_Deleted])
    }
    update(obj) {
        const {Sno, From, Message_Body, Create_Date, Parent_Message_Id, To, Attachment, Is_Read, Is_Deleted} = obj
        return this.dao.run(
            `UPDATE Message SET "from" = $1, Message_Body = $2, Create_Date = $3, Parent_Message_Id = $4, "to" = $5, Attachment = $6, Is_Read = $7, Is_Deleted = $8  WHERE Sno = $9`,
            [From, Message_Body, Create_Date, Parent_Message_Id, To, Attachment, Is_Read, Is_Deleted, Sno]
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
