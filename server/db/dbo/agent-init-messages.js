class agentInitMessages {
  constructor(dao) {
    this.dao = dao
  }

  createTable() {
    const sql = `
    CREATE TABLE IF NOT EXISTS agent_init_messages (
      sno        BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      message TEXT NOT NULL
  )`
    return this.dao.run(sql)
  }

  getAll() {
    return this.dao.all(`SELECT * FROM agent_init_messages`)
  }

  get(id) {
    return this.dao.get(
      `SELECT * FROM agent_init_messages WHERE sno = $1`,
      [id])
  }

  create(agentName, message) {
      return this.dao.run(
        'INSERT INTO agent_init_messages (name, message) VALUES ($1,$2) RETURNING *',
        [agentName, message])
  }
  update(obj) {
      const {sno, agentName, message} = obj
      return this.dao.run(
          `UPDATE agent_init_messages SET name = $1, message = $2 WHERE sno = $3`,
          [agentName, message, sno]
      )
  }
  delete(id) {
      return this.dao.run(
        `DELETE FROM agent_init_messages WHERE sno = $1`,
        [id]
      )
  }
}

module.exports = agentInitMessages;
