import database from './connection.mjs';

class Subscriptions {
  static async getSubscriptions() {
    const sql = `
      SELECT * FROM subscriptions;
    `
    const result = await database.query(sql);
    return result.rows || [];
  }
  
  static async addSubscription({ title, amount, initialDate, accountId, lastDate = null, description = null }) {
    const sql = `
      INSERT INTO subscriptions (
        title,
        amount,
        initial_date,
        account_id,
        last_date,
        description
      ) VALUES (
        $1, $2, $3, $4, $5, $6
      ) RETURNING *
    `
    
    const result = await database.query(sql, [title, amount, initialDate, accountId, lastDate, description]);
    return result.rows || [];
  }
}

export default Subscriptions;