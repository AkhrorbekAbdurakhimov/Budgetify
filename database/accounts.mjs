import database from './../database/connection.mjs';

class Accounts {
  static async getAllAccounts() {
    const sql = `
      SELECT * FROM accounts;
    `;
    
    const result = await database.query(sql);
    return result.rows || [];
  }
  
  static async getAccount({ id }) {
    const sql = `
      SELECT * FROM accounts WHERE id = $1;
    `;
    
    const result = await database.query(sql, [id]);
    return result.rows || [];
  }
  
  static async addAccount({ title, description, currency, userId }) {
    const sql = `
      INSERT INTO accounts (
        title, 
        description, 
        currency,
        user_id
      ) VALUES (
        $1,
        $2,
        $3,
        $4
      ) RETURNING *;
    `;
    
    const result = await database.query(sql, [title, description, currency, userId]);
    return result.rows || [];
  }
  
  static async updateAccountBalance(type, amount, accountId) {
    const sql = `
      UPDATE accounts
      SET balance = balance ${type === 'income' ? '+' : '-'} ${amount}
      WHERE id = ${accountId}
    `
    await database.query(sql)
  }
  
  static async GetEstimateBalance(type, amount, accountId) {
    const sql = `
      SELECT
        balance ${type === 'income' ? '+' : '-'} ${amount} as balance
      FROM
        accounts
      WHERE id = ${accountId};
    `
    const result = await database.query(sql);
    return result.rows || []
  }
}

export default Accounts;