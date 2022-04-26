import database from './connection.mjs';

class Accounts {
  static async getAllAccounts(id) {
    const sql = `
      SELECT 
        a.id,
        a.title,
        c.title AS currency,
        a.balance
      FROM 
        accounts a
      JOIN currencies c ON c.id = a.currency_id
      WHERE user_id = $1;
    `;
    
    const result = await database.query(sql, [id]);
    return result.rows || [];
  }
  
  static async getAccount({ id }) {
    const sql = `
      SELECT 
        a.id,
        a.title,
        c.title AS currency,
        a.description,
        a.balance
      FROM 
        accounts a
      JOIN currencies c ON c.id = a.currency_id
      WHERE a.id = $1;
    `;
    
    const result = await database.query(sql, [id]);
    return result.rows || [];
  }
  
  static async addAccount({ title, description, currencyId, userId }) {
    const sql = `
      INSERT INTO accounts (
        title, 
        description, 
        currency_id,
        user_id
      ) VALUES (
        $1,
        $2,
        $3,
        $4
      ) RETURNING *;
    `;
    
    const result = await database.query(sql, [title, description, currencyId, userId]);
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
  
  static async deleteAccount(accountId) {
    const sql = `
      DELETE FROM accounts
      WHERE
        id = $1;
    `
    await database.query(sql, [accountId]);
  }
}

export default Accounts;